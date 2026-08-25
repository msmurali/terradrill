import {
  Component,
  DestroyRef,
  computed,
  ElementRef,
  afterNextRender,
  effect,
  input,
  signal,
  viewChild,
} from '@angular/core';
import GlobeGl, { GlobeInstance } from 'globe.gl';
import { MeshPhongMaterial } from 'three';
import { Country } from '../../../interfaces/country.interface';
import { CountryFeature } from '../../../interfaces/geo';
import { GameService } from '../../../services/game.service';
import { GeoService } from '../../../services/geo.service';
import { flagUrl } from '../../../utils/flag-url.util';

const OCEAN = '#1b2740';
const LAND = '#3b4b66';
const TARGET = '#4ade80';
const STROKE = '#0d1526';

const FLY_MS = 1200;
const ALTITUDE = 2.5;

@Component({
  selector: 'app-globe',
  imports: [],
  templateUrl: './globe.html',
  styleUrl: './globe.scss',
})
export class Globe {
  country = input.required<Country | null>();
  round = input<number>(0);

  readonly flagSrc = computed(() => flagUrl(this.country()?.code));

  private readonly host = viewChild.required<ElementRef<HTMLDivElement>>('globeHost');
  /** A signal, not a field — the effect must re-run once init() assigns it. */
  private readonly globe = signal<GlobeInstance | undefined>(undefined);
  private resizeObserver?: ResizeObserver;
  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  constructor(
    readonly geoService: GeoService,
    readonly gameService: GameService,
    destroyRef: DestroyRef,
  ) {
    this.geoService.load();

    // Needs a laid-out host element to size the canvas.
    afterNextRender(() => this.init());

    // Geometry is pushed once, when the features land.
    effect(() => {
      const globe = this.globe();
      const features = this.geoService.features();

      if (!globe || !features.length) return;

      globe.polygonsData(features as object[]);
    });

    // Per round: recolour caps and move the camera. No geometry work.
    effect(() => {
      const globe = this.globe();
      const target = this.country();

      if (!globe || !this.geoService.features().length) return;

      globe.polygonCapColor((f) =>
        (f as CountryFeature).properties.code === target?.code ? TARGET : LAND,
      );

      if (target) this.flyTo(target);
    });

    destroyRef.onDestroy(() => {
      this.resizeObserver?.disconnect();
      this.globe()?._destructor();
    });
  }

  private init(): void {
    const el = this.host().nativeElement;

    const globe = new GlobeGl(el, { animateIn: false })
      .backgroundColor('rgba(0,0,0,0)')
      .showGlobe(true)
      .showAtmosphere(false)
      .polygonAltitude(0.012)
      .polygonSideColor(() => 'rgba(0,0,0,0)')
      .polygonStrokeColor(() => STROKE)
      .polygonsTransitionDuration(0);

    (globe.globeMaterial() as MeshPhongMaterial).color.set(OCEAN);

    // A 3x-DPI phone would otherwise render 9x the pixels for no visible gain.
    globe.renderer().setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Without this the globe sits at globe.gl's default altitude of 2.5
    // and renders noticeably smaller until the first flyTo().
    globe.pointOfView({ lat: 0, lng: 0, altitude: ALTITUDE });

    // Let the round advance drive rotation rather than the pointer.
    const controls = globe.controls();
    controls.enableZoom = false;
    controls.autoRotate = false;

    // On touch, OrbitControls claims the drag and the page can no longer be
    // scrolled past the globe — so hand dragging back to the browser there.
    controls.enabled = !window.matchMedia('(pointer: coarse)').matches;

    this.resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      globe.width(width).height(height);
    });
    this.resizeObserver.observe(el);

    this.globe.set(globe);
  }

  private flyTo(target: Country): void {
    const feature = this.geoService.byCode().get(target.code);
    if (!feature) return;

    const { lat, lng } = feature.properties;
    this.globe()?.pointOfView({ lat, lng, altitude: ALTITUDE }, this.flightMs());
  }

  private flightMs(): number {
    return this.reducedMotion.matches ? 0 : FLY_MS;
  }
}

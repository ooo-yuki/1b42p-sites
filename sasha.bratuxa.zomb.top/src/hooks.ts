import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Rain } from './lib/rain';
import { startBeacon } from './lib/beacon';
import './style.css';

const reduced =
  typeof matchMedia !== 'undefined' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useRain(canvasRef: React.RefObject<HTMLCanvasElement | null>): React.MutableRefObject<Rain | null> {
  const rainRef = useRef<Rain | null>(null);
  useEffect(() => {
    if (reduced || !canvasRef.current) return;
    const rain = new Rain(canvasRef.current);
    rainRef.current = rain;
    return () => {
      rain.destroy();
      rainRef.current = null;
    };
  }, [canvasRef]);
  return rainRef;
}

export function useIntro(): void {
  useEffect(() => {
    if (!gsap || reduced) {
      document.querySelectorAll('#mega span').forEach((el) => el.classList.add('fill'));
      return;
    }
    gsap.from('#kicker', { y: -18, autoAlpha: 0, duration: 0.7, ease: 'power2.out' });
    gsap.from('#mega span', {
      y: 90, autoAlpha: 0, rotation: () => Math.random() * 30 - 15,
      duration: 1, stagger: 0.14, ease: 'back.out(1.5)', delay: 0.15,
    });
    gsap.from('#sub', { y: 24, autoAlpha: 0, duration: 0.7, delay: 0.7, ease: 'power2.out' });
    gsap.from('.pill', { y: 24, autoAlpha: 0, duration: 0.6, delay: 0.9, ease: 'back.out(1.7)', stagger: 0.1 });
    gsap.from('#hint', { autoAlpha: 0, duration: 1, delay: 1.2 });
    // размонтирование mid-flight: убить и снять инлайн-стили, иначе фриз opacity 0
    return () => {
      gsap.killTweensOf('#kicker, #mega span, #sub, .pill, #hint');
      gsap.set('#kicker, #mega span, #sub, .pill, #hint', { clearProps: 'opacity,visibility,transform' });
    };
  }, []);
}

export function useBeacon(): void {
  useEffect(() => {
    startBeacon('sasha');
  }, []);
}

export function domRing(x: number, y: number): void {
  if (reduced || !gsap) return;
  const r = document.getElementById('ring');
  if (!r) return;
  gsap.killTweensOf(r);
  gsap.set(r, { x, y, scale: 1, autoAlpha: 1 });
  gsap.to(r, { scale: 9, autoAlpha: 0, duration: 0.7, ease: 'power2.out', overwrite: 'auto' });
}

export function pulseScore(sel = '#score'): void {
  if (!gsap) return;
  gsap.killTweensOf(sel);
  gsap.fromTo(sel, { scale: 1 }, { scale: 1.12, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out', overwrite: 'auto', clearProps: 'transform' });
}

/**
 * MobileNav.test.tsx
 * TDD RED phase — tests written before implementation
 * Verifies: hamburger trigger, drawer open/close, backdrop, scroll lock, nav items
 */
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import MobileNav from './MobileNav';

afterEach(() => {
  cleanup();
  // Reset body styles between tests
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  document.documentElement.style.overflow = '';
});

describe('MobileNav', () => {
  it('renders a hamburger button that is only visible on mobile (md:hidden)', () => {
    render(<MobileNav />);
    const btn = screen.getByRole('button', { name: /open navigation menu/i });
    expect(btn).toBeInTheDocument();
    // md:hidden is a Tailwind class — verify the wrapper div carries it
    const wrapper = btn.closest('div');
    expect(wrapper?.className).toContain('md:hidden');
  });

  it('drawer is hidden (translate-x-full) when closed', () => {
    render(<MobileNav />);
    const nav = screen.getByRole('dialog');
    expect(nav.className).toContain('translate-x-full');
    expect(nav.className).not.toContain('translate-x-0');
  });

  it('clicking hamburger opens the drawer (translate-x-0)', () => {
    render(<MobileNav />);
    const openBtn = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(openBtn);
    const nav = screen.getByRole('dialog');
    expect(nav.className).toContain('translate-x-0');
    expect(nav.className).not.toContain('translate-x-full');
  });

  it('clicking X button closes the drawer', () => {
    render(<MobileNav />);
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    fireEvent.click(screen.getByRole('button', { name: /close navigation menu/i }));
    const nav = screen.getByRole('dialog');
    expect(nav.className).toContain('translate-x-full');
  });

  it('clicking backdrop closes the drawer', () => {
    render(<MobileNav />);
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    // Backdrop is the div with aria-hidden=true
    const backdrop = document.querySelector('[aria-hidden="true"]');
    expect(backdrop).toBeTruthy();
    fireEvent.click(backdrop!);
    const nav = screen.getByRole('dialog');
    expect(nav.className).toContain('translate-x-full');
  });

  it('clicking a nav link closes the drawer', () => {
    render(<MobileNav />);
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    const servicesLink = screen.getByRole('link', { name: /services/i });
    fireEvent.click(servicesLink);
    const nav = screen.getByRole('dialog');
    expect(nav.className).toContain('translate-x-full');
  });

  it('locks body scroll when drawer is open', () => {
    render(<MobileNav />);
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.documentElement.style.overflow).toBe('hidden');
  });

  it('restores body scroll when drawer is closed', () => {
    render(<MobileNav />);
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    fireEvent.click(screen.getByRole('button', { name: /close navigation menu/i }));
    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('renders all four nav items: Services, About, Reviews, Contact', () => {
    render(<MobileNav />);
    expect(screen.getByRole('link', { name: /services/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /reviews/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });
});

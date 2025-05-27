import { CommonModule } from '@angular/common';
import { Component, Output, output, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { SettingsService } from '../../servies/settingsService/settings.service';
@Component({
  selector: 'app-header',
  imports: [CommonModule, MatIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true,
})
export class HeaderComponent {
  searchTerm = signal<string>('');

  constructor(private settingsService: SettingsService) {}

  onToggleSidebar(): void {
    this.settingsService.setSideBarCollapsed(
      !this.settingsService['IsSideBarCollapsed'].getValue()
    );
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.searchInDOM(value);
  }

  searchInDOM(term: string): void {
    this.clearHighlights();
    if (!term) return;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    let node: Text | null;
    const regex = new RegExp(term, 'gi');
    while ((node = walker.nextNode() as Text | null)) {
      if (
        node.parentElement &&
        node.nodeValue &&
        regex.test(node.nodeValue) &&
        !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.parentElement.tagName)
      ) {
        const span = document.createElement('span');
        span.style.background = '#ffe082';
        span.style.color = '#000';
        span.className = 'search-highlight';
        span.innerHTML = node.nodeValue.replace(regex, match => `<mark>${match}</mark>`);
        node.parentElement.replaceChild(span, node);
      }
    }
  }

  clearHighlights(): void {
    document.querySelectorAll('.search-highlight').forEach(el => {
      if (el.parentNode && el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
        el.parentNode.replaceChild(el.childNodes[0], el);
      } else if (el.parentNode) {
        el.parentNode.replaceChild(document.createTextNode(el.textContent || ''), el);
      }
    });
  }
}
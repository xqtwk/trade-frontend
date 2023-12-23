import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '[appAutoExpand]',
  standalone: true
})
export class AutoExpandDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input')
  onInput(): void {
    this.adjustHeight();
  }

  private adjustHeight(): void {
    const textarea = this.el.nativeElement;
    this.renderer.setStyle(textarea, 'height', 'inherit'); // Reset the height
    const height = textarea.scrollHeight; // Get the scroll height
    this.renderer.setStyle(textarea, 'height', `${height}px`);
  }

}

import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-hint-panel',
  templateUrl: './hint-panel.component.html',
  styleUrl: './hint-panel.component.scss'
})
export class HintPanelComponent {
  /** The multiplier whose table we're showing (e.g. 7 for 7× table) */
  tableNumber = input.required<number>();
  /** In partial mode, this row's answer is hidden. -1 means show everything. */
  hideRow = input<number>(-1);
  /** Show header label */
  headerLabel = input<string>('');

  readonly rows = computed(() =>
    Array.from({ length: 10 }, (_, i) => ({
      factor: i + 1,
      product: this.tableNumber() * (i + 1),
      hidden: this.hideRow() === (i + 1)
    }))
  );
}

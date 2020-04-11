import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExportSettings } from 'src/app/core/services/data-access.service';

@Component({
  selector: 'cubes-export-settings',
  templateUrl: './export-settings.component.html',
  styleUrls: ['./export-settings.component.scss']
})
export class ExportSettingsComponent implements OnInit {
  public settings: ExportSettings;

  constructor(
    private dialogRef: MatDialogRef<ExportSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { this.settings = data as ExportSettings; }

  ngOnInit() { }
  onClose() { this.dialogRef.close(); }
  onSave() { this.dialogRef.close(this.settings); }
}

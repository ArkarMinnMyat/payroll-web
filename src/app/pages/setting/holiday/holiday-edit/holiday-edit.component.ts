import { Component, effect, input, signal } from '@angular/core';
import { WidgetsModule } from '../../../../widgets/widgets.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HolidayService } from '../../../../services/holiday.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-holiday-edit',
  standalone: true,
  imports: [
    WidgetsModule, ReactiveFormsModule
  ],
  templateUrl: './holiday-edit.component.html',
  styles: ``
})
export class HolidayEditComponent {

  edit = signal<boolean>(false)
  types = signal<string[]>(['Weekend', 'Gazetted', 'Special'])
  id = input<number>()

  form:FormGroup

  constructor(builder:FormBuilder, private service:HolidayService, private router:Router) {
    this.form = builder.group({
      id: 0,
      date: ['', Validators.required],
      type: ['', Validators.required],
      holiday: ['', Validators.required],
      remark: ''
    })

    effect(() => {
      const idValue = this.id()

      if(idValue) {
        service.findById(idValue).subscribe(result => {
          if(result.success) {
            this.edit.set(true)
            this.form.patchValue(result.payload)
          }
        })
      }
    })
  }

  save() {
    if(this.form.valid) {
      this.service.save(this.edit(), this.form.value).subscribe(result => {
        if(result.success) {
          this.router.navigate(['/settings', 'holiday', 'list'])
        }
      })
    }
  }

}

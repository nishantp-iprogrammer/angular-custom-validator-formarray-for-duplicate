import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormArray,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  formArray = new FormArray([], [Validators.required]);

  createGroup(data: any) {
    data = data || { name: null };
    return new FormGroup({
      name: new FormControl(data.name, [Validators.required]),
    });
  }

  duplicates = [];

  ngOnInit() {
    this.addMore();
    setTimeout(() => {
      this.checkDuplicates('name');
    });
    this.formArray.valueChanges.subscribe((x) => {
      this.checkDuplicates('name');
    });
  }

  addMore() {
    this.formArray.push(this.createGroup({ name: '' }));
  }

  removePP(remIndex): any {
    this.formArray.removeAt(remIndex);
  }

  contentArray = [];
  saveForm() {
    console.log(this.formArray.value);
    // console.log(this.formArray.value[0].name);
    for (let i = 0; i < this.formArray.length; i++) {
      this.contentArray.push(this.formArray.value[i].name);
    }
    console.log(this.contentArray);
  }

  checkDuplicates(key_form) {
    for (const index of this.duplicates) {
      let errors =
        (this.formArray.at(index).get(key_form).errors as Object) || {};
      delete errors['duplicated'];
      this.formArray
        .at(index)
        .get(key_form)
        .setErrors(errors as ValidationErrors);
    }
    this.duplicates = [];

    let dict = {};
    this.formArray.value.forEach((item, index) => {
      dict[item.name] = dict[item.name] || [];
      dict[item.name].push(index);
    });
    for (var key in dict) {
      if (dict[key].length > 1)
        this.duplicates = this.duplicates.concat(dict[key]);
    }
    for (const index of this.duplicates) {
      this.formArray.at(index).get(key_form).setErrors({ duplicated: true });
    }
  }
}

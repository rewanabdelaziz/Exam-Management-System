import { Component, computed } from '@angular/core';
import { ManageExams } from '../../services/manage-exams';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-statistics',
  imports: [DatePipe],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css',
})
export class Statistics {

  data
  constructor(private _manageExams: ManageExams ){
    this.data= this._manageExams.dashboardStats
    // console.log(this.data)
   
  }


  stats = computed(() => this.data().summary);
  
  recentExams = computed(() => this.data().recentExams);
  recentResults = computed(() => this.data().recentResults);
 
}
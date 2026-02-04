import { Component, computed} from '@angular/core';
import { ManageExams } from '../../services/manage-exams';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-results',
  imports: [DatePipe],
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class Results {
  data
  constructor(private _manageExams : ManageExams){
     this.data =  this._manageExams.dashboardStats
  }

  
 
  allResults =computed(()=> this.data().results)

  stats = computed(() => {
    const data = this.allResults();
    //  console.log("res",this.allResults())
    const total = data.length;
    
    if (total === 0) return { total: 0, avgScore: 0, passRate: 0 };

    const avgScore = Math.round(data.reduce((acc, curr) => acc + (curr.score || 0), 0) / total);
    const passedCount = data.filter(r => r.passed).length;
    const passRate = Math.round((passedCount / total) * 100);

    return { total, avgScore, passRate };
  });

}

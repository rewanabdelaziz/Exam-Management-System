import { Component, computed} from '@angular/core';
import { ManageExams } from '../../services/manage-exams';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-results',
  imports: [DatePipe],
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class Results {
 
  allResults 
  constructor(private _manageExams : ManageExams){
     this.allResults = toSignal(this._manageExams.getAllResultsWithDetails(), { initialValue: [] });
  }

  stats = computed(() => {
    const data = this.allResults();
    const total = data.length;
    
    if (total === 0) return { total: 0, avgScore: 0, passRate: 0 };

    const avgScore = Math.round(data.reduce((acc, curr) => acc + (curr.score || 0), 0) / total);
    const passedCount = data.filter(r => r.passed).length;
    const passRate = Math.round((passedCount / total) * 100);

    return { total, avgScore, passRate };
  });

}

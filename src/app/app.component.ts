import { ɵNullViewportScroller } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Candidate } from './candidate';
import { CandidateService } from './candidate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public candidates!: Candidate[];
  public editCandidate: Candidate | undefined;
  public deleteCandidate: Candidate | undefined;

  constructor(private candidateService: CandidateService) { }

  ngOnInit() {
    this.getCandidates();
  }

  public getCandidates(): void {
    this.candidateService.getCandidates().subscribe((response: Candidate[]) => {
      this.candidates = response;
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
    );
  }

  public onAddCandidate(addForm: NgForm): void {
    document.getElementById('add-candidate-form')?.click();
    this.candidateService.addCandidate(addForm.value).subscribe(
      (response: Candidate) => {
        console.log(response);
        this.getCandidates();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      },
    );
  }

  public onUpdateCandidate(candidate: Candidate): void {
    document.getElementById('edit-candidate-form')?.click();
    this.candidateService.updateCandidate(candidate).subscribe(
      (response: Candidate) => {
        console.log(response);
        this.getCandidates();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }

  public onDeleteCandidate(candidateId: number): void {
    this.candidateService.deleteCandidate(candidateId).subscribe(
      (response: void) => {
        console.log(response);
        this.getCandidates();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        this.getCandidates();
      },
    );
  }

  public searchCandidates(key: string): void {
    console.log(key);
    const results: Candidate[] = [];

    for (const candidate of this.candidates) {
      if (candidate.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || candidate.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(candidate);
      }
    }
    this.candidates = results;
    if (results.length === 0 || !key) {
      this.getCandidates();
    }
  }

  public onOpenModal(candidate: Candidate| undefined, mode: string):void {

    const container = document.getElementById('main-container');

    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle','modal');
    if (mode === 'add'){
      button.setAttribute('data-target','#addCandidateModal');
    }
    if (mode === 'edit'){
      this.editCandidate = candidate;
      button.setAttribute('data-target','#updateCandidateModal');
    }
    if (mode === 'delete'){
      this.deleteCandidate = candidate;
      button.setAttribute('data-target','#deleteCandidateModal');
    }

    container?.appendChild(button);
    button.click();


  }

}

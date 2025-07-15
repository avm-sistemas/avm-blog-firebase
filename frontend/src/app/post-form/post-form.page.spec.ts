import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostFormPage } from './post-form.page';

describe('PostFormPage', () => {
  let component: PostFormPage;
  let fixture: ComponentFixture<PostFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PostFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

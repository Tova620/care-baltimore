import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

// Import all your components here
import { HomepageComponent } from './homepage/homepage.component';
import { CaringForSeniorsComponent } from './caring-for-seniors/caring-for-seniors.component';
import { JoinOurVolunteersComponent } from './join-our-volunteers/join-our-volunteers.component';
import { SignUpForVisitsComponent } from './sign-up-for-visits/sign-up-for-visits.component';
import { DonateNowComponent } from './donate-now/donate-now.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { RoshHashanaComponent } from './rosh-hashana/rosh-hashana.component';
import { PurimComponent } from './purim/purim.component';
import { ChanukahComponent } from './chanukah/chanukah.component';
import { WeeklyVisitsComponent } from './weekly-visits/weekly-visits.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { VisitLogComponent } from './visit-log/visit-log.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'caring-for-seniors', component: CaringForSeniorsComponent },
  { path: 'join-our-volunteers', component: JoinOurVolunteersComponent },
  { path: 'sign-up-for-visits', component: SignUpForVisitsComponent },
  { path: 'donate-now', component: DonateNowComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'rosh-hashana', component: RoshHashanaComponent },
  { path: 'purim', component: PurimComponent },
  { path: 'chanukah', component: ChanukahComponent },
  { path: 'weekly-visits', component: WeeklyVisitsComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'visit-log', component: VisitLogComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Use forRoot to configure routes at the app level
  exports: [RouterModule]  // Export RouterModule so it's available in your app
})
export class AppRoutingModule {}

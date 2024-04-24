import { Component, OnInit } from '@angular/core';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-home-nav',
  templateUrl: './home-nav.component.html',
  styleUrls: ['./home-nav.component.scss']
})
export class HomeNavComponent implements OnInit {

  constructor(private fileService: FileService){}

  ngOnInit(): void {
    this.filterAndSave()
  }

  filterAndSave(): void {
    const filePath = 'assets/JSON/filtered.json'; 

    this.fileService.getJsonData(filePath).subscribe((data : any) => {
      console.log('data ', data)
      
      const filteredData = this.fileService.filterData(data);

      // Salvataggio dei dati filtrati in un nuovo file JSON
      this.fileService.downloadFilteredData(filteredData, 'filtered_data');
    });
  }

}

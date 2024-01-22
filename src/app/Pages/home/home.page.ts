import { Component, OnInit } from '@angular/core';
import { getDownloadURL, listAll, ref, Storage } from '@angular/fire/storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  images:any=[]
  listarProdutos() {
    const listRef = ref(this.storage, 'slides');
    listAll(listRef)
      .then((res) => {
        res.items.forEach((itemRef) => {
          getDownloadURL(itemRef).then((res) => {
            this.images.push(res)
          })
        });
      }).catch((error) => {
      });
  }

  constructor(private storage:Storage) { }

  ngOnInit() {
    this.listarProdutos()
  }

}

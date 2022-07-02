import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';


@Component({
  selector: 'app-admin-carpeta',
  templateUrl: './admin-carpeta.component.html',
  styleUrls: ['./admin-carpeta.component.scss']
})
export class AdminCarpetaComponent implements OnInit {

  dataFolder:any;
  stringTree:string;
  dataSourceT:any;

  treeControl = new NestedTreeControl<any>(node => node.children);
  dataSource = new MatTreeNestedDataSource<any>();

  constructor(private route:Router) {
    this.stringTree = "";
    this.dataSourceT = {};
  }

  ngOnInit(): void {
    let userLoged = this.getUserLoged();
    console.log(`->${userLoged}<-`);
    this.redirectUser(userLoged);

    // Obtener data
    fetch('http://127.0.0.1:3030/data')
    .then(response => response.json())
    .then(response => {
      console.log(response);
      this.dataSource.data = [this.treeRecursive(response, "")];
    });
  }

  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;

  private treeRecursive(folder: any, parent: string):any {
    if (folder === null || folder === undefined) {
      return {};
    }

    let children:any[] = [];

    folder.files.forEach((file: any) => {
      children.push({
        "name": file.name,
        "path": `${parent}/${file.name}`.replace('//', '/').replace('//', '/'),
      });
    });

    folder.folders.forEach((folderc: any) => {
      children.push(this.treeRecursive(folderc, `${parent}/${folder.name}`));
    });

    let node = {
      "name": folder.name,
      "path": `${parent}/${folder.name}`.replace('//', '/').replace('//', '/'),
      "children": children
    }

    return node;
  }

  private getUserLoged(): string {
    let userLoged = "";
    let cookies = document.cookie.split(';');

    cookies.forEach(cookie => {
      let cookieSplit = cookie.trim().split('=');
      if (cookieSplit[0] === 'loged') {
        userLoged = cookieSplit[1].trim();
      }
    });

    return userLoged;
  }

  private redirectUser(user: string): void {
    if (user !== 'admin') {
      this.route.navigate(['/access-denied']);
    }
  }

  carpetaSeleccionada(path:string): void {
    alert("Seleccionaste " + path);
  }

}

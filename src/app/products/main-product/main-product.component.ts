import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { Alert } from 'selenium-webdriver';
import { ProductModel } from 'src/app/shared/models/ProductModel';
import { AlertService } from 'src/app/shared/services/alert-service/alert.service';
import { ProductService } from 'src/app/shared/services/product-service/product.service';
import { messageSaveSuccess, titleSaveSuccess } from '../constant/product-message';

@Component({
  selector: 'app-main-product',
  templateUrl: './main-product.component.html',
  styleUrls: ['./main-product.component.css']
})
export class MainProductComponent implements OnInit, OnDestroy {

  products: ProductModel[] = [];
  product: ProductModel;

  constructor(private readonly productService: ProductService,
              private readonly alertService: AlertService) {
  }

  ngOnInit(): void {
    // created form
    // valid users
    // called initial services
    this.initialCalls();
  }

  initialCalls(): void {
    this.getProducts().subscribe();
  }

  getProducts(): Observable<ProductModel[]> {
    return this.productService.query().pipe(
      tap((products: ProductModel[]) => {
        console.log(products);
        this.products = products;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        this.alertService.showError(error);
        return throwError(error);
      })
    );
  }

  onSaveProduct(product: ProductModel): void {
    this.getObservableSave(product).pipe(
      mergeMap(() => {
        return this.getProducts();
      })
    ).subscribe();
  }

  getObservableSave(product: ProductModel): Observable<ProductModel> {
    return this.productService.store(product).pipe(
      tap(() => {
        this.alertService.show(messageSaveSuccess, titleSaveSuccess);
      }),
      catchError( (error: HttpErrorResponse) => {
        this.alertService.showError(error);
        return throwError(error);
      })
    );
  }

  onClickProduct(product: ProductModel): void {
    this.product = product;
  }

  onUpdateProduct(product: ProductModel): void{
    this.getObservableUpdate(product).pipe(
      mergeMap(() => {
        return this.getProducts();
      })
    ).subscribe();
  }

  getObservableUpdate(product: ProductModel): Observable<ProductModel> {
    return this.productService.update(product).pipe(
      tap(() => {
        this.alertService.show(messageSaveSuccess, titleSaveSuccess);
      }),
      catchError( (error: HttpErrorResponse) => {
        this.alertService.showError(error);
        return throwError(error);
      })
    );
  }


  onDeletProduct(id: number): void{
    this.productService.delete(id).subscribe((message)=>{  
    });

    alert("Deleted!!");
    this.getProducts().subscribe();
  }


  ngOnDestroy(): void {
    // killed subcriptions
    // called services -
  }

}

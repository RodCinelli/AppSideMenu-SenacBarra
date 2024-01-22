import { Component, OnInit } from '@angular/core';
import { collection, Firestore, getDocs, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { getStorage, ref, listAll, Storage, getDownloadURL, uploadBytes } from '@angular/fire/storage';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-edit-produtos',
  templateUrl: './edit-produtos.page.html',
  styleUrls: ['./edit-produtos.page.scss'],
})
export class EditProdutosPage implements OnInit {
  isImages:boolean=false
  foto: any
  imageRef: any
  images: any = []
  imgSrc: any
  isToastOpen = false;
  produtos: any = []
  isModalOpen = false;
  isModalOpen1 = false;
  produto:any={
    id:'',
    nome:'',
    descricao:'',
    preco:'',
    qtd:'',
    image:''
  }
  constructor(private storage: Storage, private firestore: Firestore) { }
  ngOnInit() {
    this.listarBanco()
    this.listarProdutos()
    console.log(uuidv4())
  }
  async listarBanco() {
    const querySnapshot = await getDocs(collection(this.firestore, "Produtos"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()['nome']}`);
      this.produtos = [...this.produtos, { id: doc.id, nome: doc.data()['nome'], descricao: doc.data()['descricao'], preco: doc.data()['preco'], qtd: doc.data()['qtd'], image: doc.data()['image'] }]
    });
  }

  mensagem(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  async EditarItem(isOpen: boolean, id: string) {
    await deleteDoc(doc(this.firestore, "Produtos", id));
    this.mensagem(isOpen)
    setTimeout(() => {
      this.produtos = []
      this.listarBanco()
    }, 2000);
  }

  CarregaProdutos(isOpen: boolean,id: any, nome: any, descricao: any, preco: any, qtd: any, image:any){
    this.isModalOpen = isOpen;
    this.produto.id=id
    this.produto.nome=nome
    this.produto.descricao=descricao
    this.produto.preco=preco
    this.produto.qtd=qtd
    this.produto.image=image   
  }
  listarImagens(isOpen1:boolean){
    this.isModalOpen = isOpen1;

  }

  EditarProduto() {
    console.log('produto Editado')
    const produto = {
      nome:this.produto.nome,
      descricao:this.produto.descricao,
      preco:this.produto.preco,
      qtd:this.produto.qtd,
      image:this.produto.image
    }
    const document = doc(collection(this.firestore, 'Produtos'),this.produto.id);
    return updateDoc(document, produto);
  }
  selectImage(img: any, modal: any) {
    this.imgSrc = img
    modal.dismiss()//fechar modal
  }
  carregarFoto(e: any) {
    this.foto = e.target.files[0]
    const newName = uuidv4(this.foto.name)
    this.imageRef = ref(this.storage, `Produtos/${newName}`)
    uploadBytes(this.imageRef, this.foto)
    setTimeout(() => {
      this.images=[]
      this.listarProdutos()
     }, 2000);
  }
  listarProdutos() {
    const listRef = ref(this.storage, 'Produtos');
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
  hideShow(){
    document.getElementById('cadImg')?.click()
  }
}









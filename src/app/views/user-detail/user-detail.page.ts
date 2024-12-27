import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavController,  LoadingController,ToastController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { FirestoreService } from '../../common/services/firestore.service';
import { Observable } from 'rxjs';
import { IonHeader, IonToolbar,   IonSelect,
 IonContent, IonLabel, IonItem, IonInput,   IonSelectOption ,
 IonSegmentButton, IonIcon, IonSegment, IonButtons, IonTitle, IonButton, IonMenu, IonList, IonMenuButton, IonText, IonCard, IonCardTitle, IonCardHeader, IonCardContent, IonBackButton } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';

 import { v4 as uuidv4 } from 'uuid';

import { LeatherStrap } from '../../common/models/lonja.model';
import { Music } from '../../common/models/music.model';


@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [IonBackButton, IonCardContent, IonSelectOption , IonSelect, IonCardHeader, IonCardTitle, IonCard, IonText, CommonModule, FormsModule, ReactiveFormsModule, IonHeader, IonButtons, IonToolbar, IonIcon, IonContent, IonSegment, IonSegmentButton, IonLabel, IonInput, IonItem, IonTitle, IonButton, IonMenu, IonList, IonMenuButton],
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA] // ✅ Añadir esta línea como solución alternativa

})
export class UserDetailPage implements OnInit {


 music: Music = {
    id: '',
    title: '',
    artist: '',
    genre: '',

    releaseDate: new Date(),
    audioUrls: [],
  };

  audioFiles: File[] = [];
  uploadedMusic: Music[] = []; // Para almacenar la música subida
  musicByGenre: { [key: string]: Music[] } = {}; // Para agrupar música por género


  genres = [
    { value: 'rock', label: 'Rock' },
    { value: 'pop', label: 'Pop' },
    { value: 'jazz', label: 'Jazz' },
    { value: 'classical', label: 'Clásica' },
    // Agrega más géneros según sea necesario
  ];
  selectedGenre: string | null = null; // Género seleccionado
  audioPlayer: HTMLAudioElement | null = null; // Reproductor de audio actual

  constructor(
    private firestoreService: FirestoreService,
        private toastController: ToastController


  ) {}

ngOnInit() {
    this.loadUploadedMusic();
  }



 // Método para cargar música subida
  loadUploadedMusic() {
    this.firestoreService.getCollectionChanges<Music>('music').subscribe((data) => {
      this.uploadedMusic = data;
      this.groupMusicByGenre(); // Agrupar música por género
      console.log('Música subida:', this.uploadedMusic);
    });
  }
  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    this.audioFiles = Array.from(files);
    console.log('Archivos seleccionados:', this.audioFiles);
  }

  async uploadMusic() {
    if (!this.music.title || !this.music.artist || !this.music.genre ) {
      this.showToast('Por favor, complete todos los campos obligatorios.', 'warning');
      return;
    }

    const id = uuidv4();
    this.music.id = id;
    this.music.releaseDate = new Date();

    try {
      if (this.audioFiles.length > 0) {
        this.music.audioUrls = [];
        for (const audio of this.audioFiles) {
          const audioUrl = await this.firestoreService.uploadFile(audio, `music/${this.music.genre}/${id}/${audio.name}`);
          console.log('URL de la música subida:', audioUrl);
          this.music.audioUrls.push(audioUrl);
        }
      }

      await this.firestoreService.createDocument(this.music, `music/${id}`);
      this.showToast('Música subida exitosamente', 'success');
      this.resetForm();
    } catch (error) {
      console.error('Error al subir la música:', error);
      this.showToast('Error al subir la música', 'danger');
    }
  }

  resetForm() {
    this.music = {
      id: '',
      title: '',
      artist: '',
      genre: '',
      releaseDate: new Date(),
      audioUrls: [],
    };
    this.audioFiles = [];
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
    });
    toast.present();
  }





 // Volver a la vista de géneros
  goBack() {
    this.selectedGenre = null; // Resetea el género seleccionado
    this.pauseAudio(); // Pausa el audio si está reproduciéndose
  }

  // Reproducir música
  playAudio(audioUrl: string) {
    if (this.audioPlayer) {
      this.audioPlayer.pause(); // Pausa cualquier audio en reproducción
    }

    this.audioPlayer = new Audio(audioUrl); // Crea un nuevo reproductor
    this.audioPlayer.play(); // Reproduce la canción seleccionada
  }

  // Pausar música
  pauseAudio() {
    if (this.audioPlayer) {
      this.audioPlayer.pause(); // Pausa el audio actual
    }
  }



// Método para agrupar música por género
  groupMusicByGenre() {
    this.musicByGenre = {}; // Reiniciar el objeto

    this.uploadedMusic.forEach((track) => {
      if (!this.musicByGenre[track.genre]) {
        this.musicByGenre[track.genre]
   this.musicByGenre[track.genre] = []; // Crear un nuevo array si no existe
      }
      this.musicByGenre[track.genre].push(track); // Agregar la canción al género correspondiente
    });
  }

   // Obtener lista de géneros
  getGenres() {
    return Object.keys(this.musicByGenre);
  }

  // Seleccionar un género
  selectGenre(genre: string) {
    this.selectedGenre = genre; // Guarda el género seleccionado
  }

 

}

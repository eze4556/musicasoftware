import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertController, ToastController, IonicModule } from '@ionic/angular';
import { FirestoreService } from './../../common/services/firestore.service';
import { Categoria } from './../../common/models/categoria.models';
import { Music } from '../../common/models/music.model';
import { v4 as uuidv4 } from 'uuid';

import { Buckle } from '../../common/models/bucke.model';

@Component({
  selector: 'app-apk-list',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule], // Asegúrate de que IonicModule esté aquí
  templateUrl: './apklist.component.html',
  styleUrls: ['./apklist.component.scss'],
})
export class ApkListComponent implements OnInit {
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

  genres = [
    { value: 'grupo', label: 'Grupo' },
    { value: 'solista', label: 'Solista' },
    { value: 'enganchados', label: 'Enganchados' },
    { value: 'bachatas', label: 'Bachatas' },
    { value: 'cuartetos', label: 'Cuartetos' },
    { value: 'tropical', label: 'Tropical' },
    { value: 'pasoDoble', label: 'PasoDoble' },
    { value: 'cumbias', label: 'Cumbias' },
    { value: 'santafesinas', label: 'Santafesinas' },
    { value: 'cumbiasTropicales', label: 'CumbiasTropicales' },
    { value: 'dj', label: 'Dj' },
    { value: 'interprete', label: 'Interprete' },
        { value: 'cachachas', label: 'Cachachas' },

  ];

  constructor(
    private firestoreService: FirestoreService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadUploadedMusic();
  }

  loadUploadedMusic() {
    this.firestoreService
      .getCollectionChanges<Music>('music')
      .subscribe((data) => {
        this.uploadedMusic = data;
        console.log('Música subida:', this.uploadedMusic);
      });
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    this.audioFiles = Array.from(files);
    console.log('Archivos seleccionados:', this.audioFiles);
  }

  async uploadMusic() {
    if (!this.music.title || !this.music.artist || !this.music.genre) {
      this.showToast(
        'Por favor, complete todos los campos obligatorios.',
        'warning'
      );
      return;
    }

    const id = uuidv4();
    this.music.id = id;
    this.music.releaseDate = new Date();

    try {
      if (this.audioFiles.length > 0) {
        this.music.audioUrls = [];
        for (const audio of this.audioFiles) {
          const audioUrl = await this.firestoreService.uploadFile(
            audio,
            `music/${this.music.genre}/${id}/${audio.name}`
          );
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

  // Método para reproducir audio
  playAudio(audioUrls: string[]) {
    if (audioUrls.length > 0) {
      const audio = new Audio(audioUrls[0]); // Reproducir el primer archivo de audio
      audio.play().catch((error) => {
        console.error('Error al reproducir el audio:', error);
        this.showToast('Error al reproducir el audio', 'danger');
      });
    } else {
      this.showToast(
        'No hay archivos de audio disponibles para reproducir.',
        'warning'
      );
    }
  }
}

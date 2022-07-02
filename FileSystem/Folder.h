#ifndef FILESYSTEM_FOLDER_H
#define FILESYSTEM_FOLDER_H

#include <iostream>
#include <vector>
#include "File.h"

class Folder {
public:
    Folder();

    string name;
    vector<File*> files;
    vector<Folder*> folders;

    void createFile(string name, int size, string cont);
    void createFolder(string name);
    Folder* getFolder(string name);
};

Folder::Folder() {}

void Folder::createFolder(string name) {

    for (Folder* folder: folders) {
        if (folder->name == name) {
            cout << " *** La carpeta " << name << " ya existe *** " << endl;
            return;
        }
    }

    Folder* f = new Folder();
    f->name = name;
    folders.push_back(f);
    cout << " *** La carpeta " << name << " fue creada exitosamente *** " << endl;
}

Folder* Folder::getFolder(string name) {
    for (Folder* folder: folders) {
        if (folder->name == name) {
            cout << " *** La carpeta " << name << " encontrada *** " << endl;
            return folder;
        }
    }

    return new Folder();
}

void Folder::createFile(string name, int size, string cont) {
    // Codigo para crear el archivo
    File* file = new File();
    file->name = name;
    file->size = size;
    file->content = cont;

    files.insert(files.end(), file);
}

#endif //FILESYSTEM_FOLDER_H

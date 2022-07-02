#ifndef FILESYSTEM_FILESYSTEM_H
#define FILESYSTEM_FILESYSTEM_H

#include <iostream>
#include "Folder.h"
#include "Consola.h"

using namespace std;

class FileSystem {

public:
    FileSystem();

    string id;
    Folder* root = new Folder();


    void createFile(string path, int size, string cont, string p);
    void makeDirectory(string path, string p);
    void syncronice(string path);
    string syncroniceRecursive(Folder* folder, string ident);

    void makeReport(string path, string name);
    string TreeReport(Folder* folder, string father);

    bool existFolderPath(string path, vector<Folder*> folders);



    string getPath(string pathFile);
    string getName(string pathFile);
};

FileSystem::FileSystem() {
    this->root->name = "/";
}

void FileSystem::makeReport(string path, string name) {
    if (name != "tree") {
        cout << endl << " *** Error, el reporte debe ser de name=tree" << endl << endl;
        return ;
    }

    string code =  "digraph G { \nrankdir=\"TB\"; \n\n";
    code += TreeReport(root, "") + "\n}";


    // Crear el archivo dot y compilarlo
    string pathDot = path.substr(0, path.size() - 4) + ".dot";
    size_t lastSlash = path.find_last_of('/');
    string folderPathOfImage = path.substr(0, lastSlash);
    string imageExtension = path.substr(path.size() - 3);

    ofstream reporte;
    reporte.open(path, ios::out);

    if (reporte.fail()) {
        string comando1 = "sudo mkdir -p \"" + folderPathOfImage + "\"";
        string comando2 = "sudo chmod -R 777 \"" + folderPathOfImage + "\"";
        system(comando1.c_str());
        system(comando2.c_str());
    }
    reporte.close();

    ofstream rep(pathDot);
    rep << code;
    rep.close();


    string comando2 = "dot -T" + imageExtension + " \"" + pathDot + "\" -o \"" + path + "\"";
    system(comando2.c_str());

    string comandoOpen = "xdg-open \"" + path + "\"";
    system(comandoOpen.c_str());

    cout << endl << " *** Correcto: Se genero el reporte tipo tree - " << pathDot << endl << endl;

}

string FileSystem::TreeReport(Folder *folder, string father) {
    string code = "";

    if (folder == NULL) {
        return "";
    }

    //cout << ident << "| Folder: " << folder->name << endl;
    string folderName = folder->name == "/" ? "root" : folder->name;
    code += "node_" + father + "_" + folderName + "[style=filled fillcolor=\"#bbdd22\" shape=component label=\"" + folder->name + "\"];" + "\n";

    // Recorrer los archivos dentro de la carpeta
    int cont = 1;
    for (File* file: folder->files) {
        //cout << ident + "++++Archivo: " << file->name << endl;
        code += "    node_" + father + "_" + folderName + to_string(cont) + "[shape=note label=\"" + file->name + "\"];" + "\n";
        code += "    node_" + father + "_" + folderName + " -> " + "node_" + father + "_" + folderName + to_string(cont) + ";\n";
        cont++;
    }

    // Recorrer las carpetas hijas
    for(Folder* f: folder->folders) {
        code += "node_" + father + "_" + folderName + " -> node_" + folderName + "_" + f->name + "\n";
        code += TreeReport(f, folderName);
    }

    return code;
}

void FileSystem::syncronice(string path) {
    string code = syncroniceRecursive(root, "");
    code = code.substr(0, code.length() - 1) + "\n";
    //cout << code << endl;

    // Crear el archivo json
    size_t lastSlash = path.find_last_of('/');
    string folderPath = path.substr(0, lastSlash);

    ofstream reporte;
    reporte.open(path, ios::out);

    if (reporte.fail()) {
        string comando1 = "sudo mkdir -p \"" + folderPath + "\"";
        string comando2 = "sudo chmod -R 777 \"" + folderPath + "\"";
        system(comando1.c_str());
        system(comando2.c_str());
    }
    reporte.close();

    ofstream rep(path);
    rep << code;
    rep.close();


    cout << endl << " *** Correcto: Se genero el JSON - " << path << endl << endl;

}

string FileSystem::syncroniceRecursive(Folder* folder, string ident) {
    string code = "";

    if (folder == NULL) {
        return "";
    }

    code += ident + "{" + "\n";
    code += ident + "\"name\": \"" + folder->name + "\"," + "\n";

    // Recorrer los archivos dentro de la carpeta
    code += ident + "\"files\": [" + "\n";


    for (File* file: folder->files) {
        code +=  ident + "    {" + "\n";
        code +=  ident + "        \"name\": \"" + file->name + "\"," + "\n";
        code +=  ident + "        \"size\": " + to_string(file->size) + "," + "\n";
        code +=  ident + "        \"content\": \"" + file->content + "\"" + "\n";
        code +=  ident + "    },";
    }
    code = code.substr(0, code.length() - 1) + "\n";
    code += ident + "],\n" ;


    // Recorrer las carpetas hijas
    code +=  ident + "\"folders\": [" + "\n";
    for(Folder* f: folder->folders) {
        code += syncroniceRecursive(f, ident + "    ");
    }
    code = code.substr(0, code.length() - 1) + "\n";
    code +=  ident + "]" + "\n";

    code +=  ident + "},";


    return code;

}

void FileSystem::makeDirectory(string path, string p) {
    if (p == "" || p == " ") {
        size_t lastIndex = path.find_last_of("/");
        size_t index = path.substr(0, lastIndex).find_last_of("/");
        string FatherPath = path.substr(0, index + 1);

        if (!existFolderPath(FatherPath, root->folders)) {
            cout << " *** Error, no se puede crear la carpeta, ya que no existen los directorios " << FatherPath << endl << endl;
            return;
        } else {
            cout << "@p se puede crear la carpeta, existen los padres" << endl;
        }
    }

    // Crear todos los directorios de la ruta
    vector<Folder*> folders = {root};
    string auxPath = path;
    while(true) {
        size_t indexInit = auxPath.find('/');
        size_t indexEnd = auxPath.substr(indexInit + 1).find('/');

        if (indexEnd == string::npos) {
            break;
        }

        string currentFolder = auxPath.substr(indexInit + 1, indexEnd);
        string restPath = auxPath.substr(indexEnd + 1);

        Folder* folder = folders.at(0);
        folders.erase(folders.begin());

        folder->createFolder(currentFolder);

        Folder* gf = folder->getFolder(currentFolder);
        folders.push_back(gf);

        auxPath = restPath;
    }

}


bool FileSystem::existFolderPath(string path, vector<Folder*> folders) {

    size_t indexInit = path.find('/');
    size_t indexEnd = path.substr(indexInit + 1).find('/');

    if (indexEnd == string::npos) {
        return true;
    }

    string currentFolder = path.substr(indexInit + 1, indexEnd);
    string restPath = path.substr(indexEnd + 1);

    //cout << "Current Folder: " << currentFolder << endl;

    for (Folder* folder: folders) {
        if (folder->name == currentFolder) {
            //cout << " Existe el folder " << currentFolder << endl;
            return existFolderPath(restPath, folder->folders) && true;
        }
    }

    return false;
}


void FileSystem::createFile(string path, int size, string cont, string p) {

    // Obtener ruta y nombre
    string pathFile = getPath(path);
    string nameFile = getName(path);

    // Si el path es la raiz
    if (pathFile == "/") {
        root->createFile(nameFile, size, cont);
        cout << endl << "El archivo " << nameFile << " se creo en " << pathFile << endl << endl;
        return;
    }


    // Validar el parametro P
    if (p == "" || p == " ") {

        if (!existFolderPath(pathFile, root->folders)) {
            cout << " *** Error, no se puede crear el archivo, ya que no existen los directorios " << pathFile << endl << endl;
            return;
        } else {
            cout << "@p se puede crear el archivo, existen los padres" << endl;
        }
    }

    // Crear todos los directorios
    makeDirectory(pathFile, "p");

    // Crear el archivo en el ultimo directorio
    // Crear todos los directorios de la ruta
    vector<Folder*> folders = {root};
    string auxPath = pathFile;
    while(true) {
        size_t indexInit = auxPath.find('/');
        size_t indexEnd = auxPath.substr(indexInit + 1).find('/');

        if (indexEnd == string::npos) {
            Folder* folder = folders.at(0);
            folder->createFile(nameFile, size, cont);

            break;
        }

        string currentFolder = auxPath.substr(indexInit + 1, indexEnd);
        string restPath = auxPath.substr(indexEnd + 1);

        Folder* folder = folders.at(0);
        folders.erase(folders.begin());

        Folder* gf = folder->getFolder(currentFolder);
        folders.push_back(gf);

        auxPath = restPath;
    }

}

string FileSystem::getPath(string pathFile) {
    char c;
    size_t lastIndex = 0;
    int length = pathFile.length();

    for (int i = length - 1; i >= 0; i--) {
        c = pathFile[i];
        if (c == '/') {
            lastIndex = i;
            break;
        }
    }

    string path = pathFile.substr(0,lastIndex + 1);

    return path;
}

string FileSystem::getName(string pathFile)  {
    char c;
    size_t lastIndex = 0;
    int length = pathFile.length();

    for (int i = length - 1; i >= 0; i--) {
        c = pathFile[i];
        if (c == '/') {
            lastIndex = i;
            break;
        }
    }

    string name = pathFile.substr(lastIndex + 1);

    return name;
}

#endif //FILESYSTEM_FILESYSTEM_H

//
// Created by gtcaps on 22/06/22.
//

#ifndef FILESYSTEM_CONSOLA_H
#define FILESYSTEM_CONSOLA_H

#include <iostream>
#include <vector>
#include <string>
#include <fstream>
#include "Mount.h"

#include "Mkdisk.h"
#include "Rmdisk.h"
#include "Fdisk.h"
#include "Mkfs.h"
#include "FileSystem.h"

using namespace std;

class Consola {
public:
    Consola();
    void ejecutar();
private:
    bool ejecutarComando(string comando);
    Mount montaje;
    vector<FileSystem*> mountedFileSystems;

    // comandos
    bool mkdisk(string comando);
    bool rmdisk(string comando);
    bool fdisk(string comando);
    bool mount(string comando);
    bool unmount(string comando);
    bool mkfs(string comando);
    bool mkfile(string comando);
    bool exec(string comando);
    bool mkdir(string comando);
    bool syncronice(string comando);
    bool rep(string comando);


    string toLowerCase(string text);

    vector<string> getAtributtes(string comando);

    vector<string> split(string data);

    bool isNumber(string text);

    string getDiskNameofPath(string diskPath);

    string getPathofDiskPath(string diskPath);

    bool validatePathOrActivateRAID(string diskPath);

    bool existsIdFileSystem (string id);

};

// IMPLEMENTACIONES DE LOS METODOS
Consola::Consola() {

}

void Consola::ejecutar() {
    string comando;

    while (true) {
        cout << "> ";
        getline(cin, comando);

        // Salir de la consola
        if (comando == "exit") {
            break;
        }

        if (comando.starts_with("/*") || comando.empty()) {
            cout << comando << endl << endl;
            continue;
        }

        ejecutarComando(comando);

    }
}

bool Consola::ejecutarComando(string comando) {

    string lcomando = toLowerCase(comando);

    // PAUSE ================
    if (lcomando.starts_with("pause")) {
        cout << endl << "*** Presione una tecla para continuar ***";
        getchar();
        cout << endl;
        return true;
    }

    // MKDISK ================
    if (lcomando.starts_with("mkdisk")) {
        return mkdisk(lcomando);
    }

    // RMDISK ================
    if (lcomando.starts_with("rmdisk")) {
        return rmdisk(lcomando);
    }

    // FDISK ================
    if (lcomando.starts_with("fdisk")) {
        return fdisk(lcomando);
    }

    // MOUNT ================
    if (lcomando.starts_with("mount")) {
        return mount(lcomando);
    }

    // UNMOUNT ================
    if (lcomando.starts_with("unmount")) {
        return unmount(lcomando);
    }

    // EXEC ================
    if (lcomando.starts_with("exec")) {
        return exec(comando);
    }

    // REP ================
    if (lcomando.starts_with("rep")) {
        return rep(lcomando);
    }

    // MKFS ================
    if (lcomando.starts_with("mkfs")) {
        return mkfs(lcomando);
    }

    // MKFILE ================
    if (lcomando.starts_with("mkfile")) {
        return mkfile(lcomando);
    }

    // MKDIR ================
    if (lcomando.starts_with("mkdir")) {
        return mkdir(lcomando);
    }

    // SYNCRONICE
    if (lcomando.starts_with("syncronice")) {
        return syncronice(lcomando);
    }

    cout << "comando: invalido" << endl;

    return false;
}

bool Consola::exec(string comando) {

    vector<string> v = getAtributtes(comando);
    string path = "";

    for (auto it: v) {
        vector<string> s = split(it);

        if (s.at(0) == "path") {
            path = s.at(1);
        }
    }

    if (path.empty() ) {
        cout << endl << " *** Parametros obligatorios: path *** " << endl << endl;
        return false;
    }

    // Leer el archivo
    ifstream archivo(path.c_str());

    string lineaComando;
    while (getline(archivo, lineaComando)) {

        if (lineaComando.empty() || lineaComando.starts_with("/*")) {
            if (lineaComando.starts_with("/*")) {
                cout << lineaComando << endl;
            }
            continue;
        }

        cout << endl << ">>> Ejecutando: " <<  lineaComando << endl;
        ejecutarComando(lineaComando);
        cout << endl << endl;

    }

    return true;
}


bool Consola::mkdisk(string comando) {
    vector<string> v = getAtributtes(comando);
    string path = "", name= "";
    int size = 0;

    for (auto it: v) {
        vector<string> s = split(it);

        if (s.at(0) == "size") {
            if (!isNumber(s.at(1))) {
                cout << endl << " *** El size debe de ser un numero mayor a 0 ***" << endl << endl;
                return false;
            }

            size = stoi(s.at(1));

            if (size <= 0 || (size % 8 != 0) ) {
                cout << endl << " *** El size debe de ser multiplo de 8 y mayor a 0 ***" << endl << endl;
                return false;
            }

        }

        if (s.at(0) == "path") {
            path = s.at(1);
        }

        if (s.at(0) == "name") {
            name = s.at(1);
        }

    }

    if (size == 0 || path.empty() || name.empty()) {
        cout << endl << " *** Parametros obligatorios: size, path, name *** " << endl << endl;
        return false;
    }

    Mkdisk mkdisk;
    return mkdisk.crearDisco(size, path, name);
}

bool Consola::rmdisk(string comando) {

    vector<string> v = getAtributtes(comando);
    string path = "";

    for (auto it: v) {
        vector<string> s = split(it);

        if (s.at(0) == "path") {
            path = s.at(1);
        }
    }

    if (path.empty() ) {
        cout << endl << " *** Parametros obligatorios: path *** " << endl << endl;
        return false;
    }

    Rmdisk rmdisk;
    return rmdisk.eliminarDisco(path);

}

bool Consola::fdisk(string comando) {

    vector<string> v = getAtributtes(comando);
    int size = 0;
    string path = "", name = "", unit = "", type = "", fit = "", del = "", add = "", mov = "";

    for (auto it: v) {
        vector<string> s = split(it);

        if (s.at(0) == "size") {
            if (!isNumber(s.at(1)) || s.at(1) == "0") {
                cout << endl << " *** El size debe de ser un numero mayor a 0 ***" << endl << endl;
                return false;
            }

            size = stoi(s.at(1));
            continue;
        }

        if (s.at(0) == "path") {
            path = s.at(1);
            continue;
        }

        if (s.at(0) == "name") {
            name = s.at(1);
            continue;
        }

        if (s.at(0) == "unit") {
            unit = s.at(1);
            continue;
        }

        if (s.at(0) == "type") {
            type = s.at(1);
            continue;
        }

        if (s.at(0) == "fit") {
            fit = s.at(1);
            continue;
        }

        if (s.at(0) == "delete") {
            del = s.at(1);
            continue;
        }

        if (s.at(0) == "add") {
            add = s.at(1);
            continue;
        }

        if (s.at(0) == "mov") {
            mov = s.at(1);
            continue;
        }
    }


    // Unidades
    if (unit == "") {
        unit  = "k";
    }

    if (type == "") {
        type = "p";
    }

    if (fit == "") {
        fit = "wf";
    }

    bool validPath = validatePathOrActivateRAID(path);
    if (!validPath) {
        cout << endl << " *** Error, El path indicado no existe *** " << endl;
        return false;
    }

    Fdisk fdisk;
    return fdisk.administrarParticion(size, path, name, unit, type, fit, del, add, mov);

}

bool Consola::mount(string comando)  {

    vector<string> v = getAtributtes(comando);
    string path = "", name = "";

    // Si no trae parametros, mostrar el listado de particiones
    if (v.size() == 0)  {
        montaje.leerMontaje();
        return true;
    }

    for (auto it: v) {
        vector<string> s = split(it);

        if (s.at(0) == "path") {
            path = s.at(1);
        }

        if (s.at(0) == "name") {
            name = s.at(1);
        }
    }


    if (path.empty() || name.empty()) {
        cout << endl << " *** Parametros obligatorios: path, name *** " << endl << endl;
        return false;
    }

    bool validPath = validatePathOrActivateRAID(path);
    if (!validPath) {
        cout << endl << " *** Error, El path indicado no existe *** " << endl;
        return false;
    }

    return montaje.montarParticion(path, name);

}

bool Consola::unmount(string comando)   {

    vector<string> v = getAtributtes(comando);
    vector<string> ids;

    for (auto it: v) {
        vector<string> s = split(it);

        if (s.at(0).starts_with("id")) {
            ids.insert(ids.end(), s.at(1));
        }

    }

    if (ids.empty()) {
        cout << endl << " *** Parametros obligatorios: id *** " << endl << endl;
        return false;
    }

    for (string id: ids) {
        //cout << endl << " *** Desmontando " << id << " ***" << endl;
        montaje.desmontarParticion(id);
    }

    return true;


}

bool Consola::rep(string comando)   {

    vector<string> v = getAtributtes(comando);
    string name = "", path = "", id = "";

    for (auto it: v) {
        vector<string> s = split(it);

        if (s.at(0).starts_with("name")) {
            name = s.at(1);
        }

        if (s.at(0).starts_with("path")) {
            path = s.at(1);
        }

        if (s.at(0).starts_with("id")) {
            id = s.at(1);
        }

    }

    if (name.empty() || path.empty() || id.empty()) {
        cout << endl << " *** Parametros obligatorios: name, path, id *** " << endl << endl;
        return false;
    }

    // Validar que la particion con el id este montada
    bool isMounted = montaje.partitionIsMounted(id);
    if (!isMounted) {
        cout << " *** Error, La particion debe de estar montada *** " << endl << endl;
        return false;
    }

    // Validar que existe el file system para el id
    bool existsFS = existsIdFileSystem(id);
    if (!existsFS) {
        cout << endl << " *** Error, el id no cuenta con un sistema de archivos, utilice mkfs  ***" << endl << endl;
        return false;
    }

    // Obtener el FileSystem montado para el id
    for (FileSystem* fs: mountedFileSystems) {
        if (fs->id == id) {
            fs->makeReport(path, name);
            return true;
        }
    }


    return true;


}

bool Consola::mkfs(string comando)   {

    vector<string> v = getAtributtes(comando);
    string id = "", type = "", add = "0", unit = "";

    for (auto it: v) {
        vector<string> s = split(it);

        if (s.at(0).starts_with("id")) {
            id = s.at(1);
        }

        if (s.at(0).starts_with("type")) {
            type = s.at(1);
        }

        if (s.at(0).starts_with("add")) {
            add = s.at(1);
        }

        if (s.at(0).starts_with("unit")) {
            unit = s.at(1);
        }
    }

    if (id.empty()) {
        cout << endl << " *** Parametros obligatorios: id *** " << endl << endl;
        return false;
    }

    if (type.empty()) {
        type = "full";
    }

    int addInt = 0;
    if (isNumber(add)) {
        addInt = stoi(add);
    } else {
        cout << endl << " *** El parametro add debe ser un numero *** " << endl << endl;
        return false;
    }

    if (unit.empty()) {
        unit = "k";
    }

    //Mkfs mkfs;
    //mkfs.formatearFS(id, type, addInt, unit, montaje);

    // Validar que la particion con el id este montada
    bool isMounted = montaje.partitionIsMounted(id);
    if (!isMounted) {
        cout << " *** Error, La particion debe de estar montada *** " << endl << endl;
        return false;
    }

    // Crear el file system para la particion con el id
    bool existsFS = existsIdFileSystem(id);
    if (existsFS) {
        cout << endl << " *** la particion " << id << " ya se encuentra formateada ***" << endl << endl;
        return false;
    }

    FileSystem* fs = new FileSystem();
    fs->id = id;
    mountedFileSystems.insert(mountedFileSystems.end(), fs);

    cout << " *** Formateo Completado " << id << endl << endl;
    return true;

}

bool Consola::mkfile(string comando)   {

    vector<string> v = getAtributtes(comando);
    string id = "", path = "", p = "", cont = "";
    int size = 0;

    for (auto it: v) {
        vector<string> s = split(it);

        if (s.at(0).starts_with("id")) {
            id = s.at(1);
        }

        if (s.at(0).starts_with("path")) {
            path = s.at(1);
        }

        if (s.at(0) == "p") {
            p = s.at(1);
        }

        if (s.at(0).starts_with("size")) {
            if (!isNumber(s.at(1))) {
                cout << endl << " *** El size debe de ser un numero  ***" << endl << endl;
                return false;
            }

            size = stoi(s.at(1));
        }

        if (s.at(0).starts_with("cont")) {
            cont = s.at(1);
        }
    }

    if (id.empty() || path.empty()) {
        cout << endl << " *** Parametros obligatorios: id, path *** " << endl << endl;
        return false;
    }


    // Validar que la particion con el id este montada
    bool isMounted = montaje.partitionIsMounted(id);
    if (!isMounted) {
        cout << " *** Error, La particion debe de estar montada *** " << endl << endl;
        return false;
    }

    // Validar que existe el file system para el id
    bool existsFS = existsIdFileSystem(id);
    if (!existsFS) {
        cout << endl << " *** Error, el id no cuenta con un sistema de archivos, utilice mkfs  ***" << endl << endl;
        return false;
    }

    // Obtener el FileSystem montado para el id
    for (FileSystem* fs: mountedFileSystems) {
        if (fs->id == id) {
            fs->createFile(path, size, cont, p);
            cout << endl << " *** Archivo Creado*** " << endl << endl;
            return true;
        }
    }


    return true;

}

bool Consola::mkdir(string comando) {

    vector<string> v = getAtributtes(comando);
    string id = "", path = "", p = "";

    for (auto it: v) {
        vector<string> s = split(it);

        if (s.at(0).starts_with("id")) {
            id = s.at(1);
        }

        if (s.at(0).starts_with("path")) {
            path = s.at(1);
        }

        if (s.at(0) == "p") {
            p = s.at(1);
        }

    }

    if (id.empty() || path.empty()) {
        cout << endl << " *** Parametros obligatorios: id, path *** " << endl << endl;
        return false;
    }


    // Validar que la particion con el id este montada
    bool isMounted = montaje.partitionIsMounted(id);
    if (!isMounted) {
        cout << " *** Error, La particion debe de estar montada *** " << endl << endl;
        return false;
    }

    // Validar que existe el file system para el id
    bool existsFS = existsIdFileSystem(id);
    if (!existsFS) {
        cout << endl << " *** Error, el id no cuenta con un sistema de archivos, utilice mkfs  ***" << endl << endl;
        return false;
    }

    if (!path.ends_with("/")) {
        path += "/";
    }

    // Obtener el FileSystem montado para el id
    for (FileSystem* fs: mountedFileSystems) {
        if (fs->id == id) {
            fs->makeDirectory(path, p);
            cout << endl << " *** Directorios creados *** " << endl << endl;
            return true;
        }
    }


    return true;
}

bool Consola::syncronice(string comando) {
    vector<string> v = getAtributtes(comando);
    string id = "", path = "";

    for (auto it: v) {
        vector<string> s = split(it);

        if (s.at(0).starts_with("id")) {
            id = s.at(1);
        }

        if (s.at(0).starts_with("path")) {
            path = s.at(1);
        }
    }

    if (id.empty() || path.empty()) {
        cout << endl << " *** Parametros obligatorios: id, path *** " << endl << endl;
        return false;
    }


    // Validar que la particion con el id este montada
    bool isMounted = montaje.partitionIsMounted(id);
    if (!isMounted) {
        cout << " *** Error, La particion debe de estar montada *** " << endl << endl;
        return false;
    }

    // Validar que existe el file system para el id
    bool existsFS = existsIdFileSystem(id);
    if (!existsFS) {
        cout << endl << " *** Error, el id no cuenta con un sistema de archivos, utilice mkfs  ***" << endl << endl;
        return false;
    }


    // Obtener el FileSystem montado para el id
    for (FileSystem* fs: mountedFileSystems) {
        if (fs->id == id) {
            fs->syncronice(path);
            return true;
        }
    }


    return true;
}

string Consola::toLowerCase(string text) {
    for_each(text.begin(), text.end(), [](char& c) {
        c = tolower(c);
    });

    return text;
}

vector<string> Consola::getAtributtes(string comando) {

    vector<string> atributos;

    string atributo = "";
    string valor = "";
    for (int i = 0; i < comando.length(); i++) {
        char c = comando[i];
        if (c == '$' || c == '@') {

            if (comando[i + 1] == 'p' && (i + 1) == comando.length() - 1) {
                atributos.insert(atributos.end(), "p-p");
                i = i + 1;
                continue;
            }

            if ((i + 2) < comando.length() && comando[i + 1] == 'p' && comando[i + 2] == ' ') {
                atributos.insert(atributos.end(), "p-p");
                i = i + 2;
                atributo = "";
                valor = "";
                continue;
            }

            for (int j = i + 1; j < comando.length(); j++) {
                c = comando [j];
                if (c == '=') {
                    i = j;
                    break;
                }

                atributo += c;
            }
        }

        if (c == '>') {

            bool comilla = false;

            for (int j = i + 1; j < comando.length(); j++) {
                c = comando [j];

                if (c == '"') {
                    comilla = !comilla;
                    continue;
                }


                if (c == ' ' && !comilla) {
                    i = j;
                    break;
                }

                valor += c;
            }

            atributos.insert(atributos.end(), atributo + "-" + valor);
            atributo = "";
            valor = "";

        }

    }

    return atributos;
}


vector<string> Consola::split(string data) {
    vector<string> s;
    size_t found = data.find("-");

    s.insert(s.end(), data.substr(0, found));
    s.insert(s.end(), data.substr(found + 1));

    return s;
}

bool Consola::isNumber(string text) {

    for (char const &c: text) {
        if (isdigit(c) == 0) {
            return false;
        }
    }

    return true;
}

string Consola::getDiskNameofPath(string diskPath) {
    char c;
    size_t lastIndex = 0;
    int length = diskPath.length();

    for (int i = length - 1; i >= 0; i--) {
        c = diskPath[i];
        if (c == '/') {
            lastIndex = i;
            break;
        }
    }

    string name = diskPath.substr(lastIndex + 1);

    return name;
}

string Consola::getPathofDiskPath(string diskPath) {
    char c;
    size_t lastIndex = 0;
    int length = diskPath.length();

    for (int i = length - 1; i >= 0; i--) {
        c = diskPath[i];
        if (c == '/') {
            lastIndex = i;
            break;
        }
    }

    string path = diskPath.substr(0,lastIndex + 1);

    return path;
}

bool Consola::validatePathOrActivateRAID(string diskPath) {

    // Validar si existe el path
    FILE* disco = fopen(diskPath.c_str(), "rb+");

    // Si el path existe, no hacemos nada
    if (disco != NULL) {
        return true;
    }

    // Si el path no existe, vamos a validar si existe una copia RAID
    string path = getPathofDiskPath(diskPath);
    string name = getDiskNameofPath(diskPath);
    string raidDiskPath =  path + "raid_" + name ;

    FILE* discoRaid  = fopen(raidDiskPath.c_str(), "rb+");

    // Si no existe el disco raid se devuelve false
    if (discoRaid == NULL) {
        return false;
    }
    fclose(discoRaid);

    // Si existe el disco raid, se procede a activar creando una copia
    cout << endl << "*** activando raid 1 ***" << endl << endl;

    string comando = "cp \"" + path + "raid_" + name + "\" \"" + path + name + "\"";
    system(comando.c_str());

    return true;

}

bool Consola::existsIdFileSystem (string id) {

    for (FileSystem* fs: mountedFileSystems) {
        if (fs->id == id) {
            return true;
        }
    }

    return false;
}

#endif //FILESYSTEM_CONSOLA_H

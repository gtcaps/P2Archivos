#ifndef FILESYSTEM_FILE_H
#define FILESYSTEM_FILE_H

#include <iostream>
using namespace std;

class File {
public:
    string name;
    int size;
    string content;

    File();
};

File::File() {}
#endif //FILESYSTEM_FILE_H

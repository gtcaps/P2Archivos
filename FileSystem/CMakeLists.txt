cmake_minimum_required(VERSION 3.22)
project(FileSystem)

set(CMAKE_CXX_STANDARD 23)

add_executable(FileSystem main.cpp Consola.h Mkdisk.h Structs.h Rmdisk.h Fdisk.h Mount.cpp Mount.h Mkfs.h File.h Folder.h FileSystem.h)

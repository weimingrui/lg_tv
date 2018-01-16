@echo off
set output_file=..\qhome.min.js
del /F /S "%output_file%"
call ant.bat
pause
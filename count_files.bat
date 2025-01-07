@echo off
call cloc . --fullpath --match-d='/(public)/' --not-match-d='/(docs)/'
pause
exit
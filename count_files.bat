@echo off
call cloc ./public --exclude-dir=docs --include-lang=JavaScript,CSS,PHP --md
pause
exit
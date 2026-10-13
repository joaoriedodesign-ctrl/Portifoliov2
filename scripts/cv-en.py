# Mantido por compatibilidade: o CV em inglês agora sai do mesmo script do português
# (scripts/cv.py), que gera os dois PDFs com o mesmo conteúdo e layout.
# Rode: python3 scripts/cv-en.py  (equivale a gerar só o EN de scripts/cv.py)
import importlib.util
from pathlib import Path

spec = importlib.util.spec_from_file_location('cv', Path(__file__).resolve().parent / 'cv.py')
cv = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cv)
cv.build(cv.EN)

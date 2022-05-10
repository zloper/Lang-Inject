import json

import pymorphy2

# todo mystem lemmatize() can be faster
lemmatization_vocab = {}
morph = pymorphy2.MorphAnalyzer()
with open("base.json", "r", encoding="utf-8") as f:
    dct = json.load(f)

with open("base_backup.json", "w", encoding="utf-8") as f:
    json.dump(dct, f, ensure_ascii=False)


def generate_new_dict():
    new_dct = {}
    for key in dct:
        morph_w = morph.parse(key)[0]
        lemma = morph_w.normal_form
        forms = lexeme_word(lemma)
        lemmatization_vocab[lemma] = forms
        new_dct[lemma] = dct[key].replace(key, lemma)

        for f in forms:
            new_dct[f] = dct[key].replace(key, f)

    return new_dct


def lexeme_word(word):
    morph_w = morph.parse(word)[0]
    lst = []
    for w in morph_w.lexeme:
        lst.append(w.word)
    return lst


new_dct = generate_new_dict()
sorted_dct = {}
for k in sorted(new_dct, key=len, reverse=True):
    sorted_dct[k] = new_dct[k]

# for k in sorted_dct:
#     print(k, sorted_dct[k])


with open("base.json", "w", encoding="utf-8") as f:
    json.dump(sorted_dct, f, ensure_ascii=False)

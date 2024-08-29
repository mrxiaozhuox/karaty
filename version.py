# --------------------------------
# this script for change all workshop's version info
# include: Cargo.toml and dependency
# --------------------------------

import sys

from os import path

from tomlkit import parse,dumps,inline_table

def to_local():
    edit_all()

def to_version(version):
    edit_all(version)

def edit_all(value = None):

    # for karaty dir
    karaty_cargo = path.join("karaty", "Cargo.toml")
    edit_dependency(karaty_cargo, "karaty-blueprint", value)

    template_value = inline_table()
    if value is None:
        template_value.update({"path": "../template", "template": True})
    else:
        template_value.update({"version": value, "template": True})
    edit_dependency(karaty_cargo, "karaty-template", template_value)

    # for docsite dir
    docsite_cargo = path.join("docsite", "Cargo.toml")
    edit_dependency(docsite_cargo, "karaty-blueprint", value)

    # for template dir
    template_cargo = path.join("template", "Cargo.toml")
    edit_dependency(template_cargo, "karaty-blueprint", value)

def edit_dependency(path, name, value):

    if value is None:
        temp = "../{}".format(name.split("-")[1])
        tab = inline_table()
        tab.update({"path": temp})
        value = tab

    cargo = None
    with open(path, "r") as file:
        content = file.read()
        cargo = parse(content)
        dep = cargo.item("dependencies")
        dep.value[name] = value
    with open(path, "w") as file:
        file.write(dumps(cargo))
    


def main():
    argument = sys.argv
    if len(argument) <= 1:
        to_local()
    else:
        to_version(argument[1])

if __name__ == "__main__":
    main()

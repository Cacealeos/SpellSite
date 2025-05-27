import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const Select = ({
  choices,
  changeChoice,
  title,
}: {
  choices: string[];
  changeChoice: (choices: string) => void;
  title: string;
}) => {
  return (
    <Menu>
      <MenuButton>{title}</MenuButton>
      <MenuItems>
        {choices.map((element) => {
          return (
            <MenuItem>
              <button onClick={() => changeChoice(element)}>{element}</button>
            </MenuItem>
          );
        })}
      </MenuItems>
    </Menu>
  );
};

export default Select;

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const Select = ({
  choices,
  changeChoice,
  title,
}: {
  choices: string[];
  changeChoice: (choice: string) => void;
  title: string;
}) => {
  return (
    <Menu>
      <MenuButton className="px-4 py-2 rounded bg-gray-200 shadow">
        {title}
      </MenuButton>

      <MenuItems className="mt-2 w-40 bg-white shadow rounded p-2">
        {choices.map((choice) => (
          <MenuItem key={choice}>
            <button
              onClick={() => changeChoice(choice)}
              className="block w-full text-left px-3 py-1 hover:bg-gray-100 rounded"
            >
              {choice}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
};

export default Select;

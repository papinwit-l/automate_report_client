import React, { useEffect, useRef, useState } from "react";
import CustomCheckbox from "./CustomCheckbox";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

function SearchCheckbox(props) {
  const {
    inputValue,
    setInputValue,
    items,
    filteredItems,
    setFilteredItems,
    selectedItem,
    setSelectedItem,
    className,
    placeholder = "",
  } = props;
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleItemClick = (item) => {
    // console.log(item);
    setSelectedItem((state) => {
      if (state.includes(item)) {
        return state.filter((i) => i !== item);
      } else {
        return [...state, item];
      }
    });
    inputRef.current?.focus();
  };

  const handleSelectAllClick = () => {
    setSelectedItem(items);
  };

  const handleClearAllClick = () => {
    setSelectedItem([]);
  };

  useEffect(() => {
    // Filter items based on input value
    const filtered = items.filter((item) =>
      item.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [inputValue]);

  useEffect(() => {
    // Handle clicks outside the component
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-popover border border-border rounded-md shadow-md max-h-60 overflow-hidden"
        >
          <div className="flex flex-col p-2 py-1 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAllClick}
                className="h-8 px-3 text-xs font-medium"
              >
                Select All - {filteredItems.length}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAllClick}
                className="h-8 px-3 text-xs font-medium"
              >
                Clear All
              </Button>
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleItemClick(item)}
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <CustomCheckbox checked={selectedItem.includes(item)} />
                  <span className="flex-1 text-sm">{item}</span>
                </div>
              ))
            ) : (
              <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                No items found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchCheckbox;

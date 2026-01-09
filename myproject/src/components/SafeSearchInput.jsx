import React, { useEffect, useRef } from 'react';

const SafeSearchInput = ({ 
  value, 
  onChange, 
  onKeyDown, 
  onFocus, 
  placeholder, 
  className, 
  id, 
  name 
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    // Force clear any email values immediately
    const clearEmailValues = () => {
      if (input.value && input.value.includes('@')) {
        input.value = '';
        if (onChange) {
          onChange({ target: { value: '' } });
        }
      }
    };

    // Clear immediately
    clearEmailValues();

    // Set up multiple clearing mechanisms
    const interval = setInterval(clearEmailValues, 50);
    
    // Observer for attribute changes
    const observer = new MutationObserver(clearEmailValues);
    observer.observe(input, { 
      attributes: true, 
      attributeFilter: ['value'] 
    });

    // Event listeners for various input events
    const handleAnyInput = (e) => {
      if (e.target.value && e.target.value.includes('@')) {
        e.target.value = '';
        e.preventDefault();
        e.stopPropagation();
        if (onChange) {
          onChange({ target: { value: '' } });
        }
      }
    };

    input.addEventListener('input', handleAnyInput, true);
    input.addEventListener('change', handleAnyInput, true);
    input.addEventListener('paste', (e) => {
      const pasteData = e.clipboardData.getData('text');
      if (pasteData && pasteData.includes('@')) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    return () => {
      clearInterval(interval);
      observer.disconnect();
      input.removeEventListener('input', handleAnyInput, true);
      input.removeEventListener('change', handleAnyInput, true);
    };
  }, [onChange]);

  const handleChange = (e) => {
    if (e.target.value && e.target.value.includes('@')) {
      e.target.value = '';
      if (onChange) {
        onChange({ target: { value: '' } });
      }
      return;
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <input
      ref={inputRef}
      id={id}
      name={name}
      type="search"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      autoComplete="new-password"
      autoCorrect="off"
      autoCapitalize="none"
      spellCheck="false"
      form="nonexistent-form-search"
      data-lpignore="true"
      data-form-type="search"
      data-1p-ignore="true"
      className={className}
    />
  );
};

export default SafeSearchInput;
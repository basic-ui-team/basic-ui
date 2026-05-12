# Accessibility Audit Reference

Detailed context and guidelines for WCAG 2.1 Level AA compliance, along with resources for learning more about accessibility practices.

## WCAG 2.1 Level AA Guidelines

### Perceivable

Ensures that information and user interface components are presentable to users in ways they can perceive.

- **1.1.1 Non-text Content** (Level A)
  - All non-text content has a text alternative serving the equivalent purpose (e.g., alt text for images, captions for videos)
  - Exceptions: controls, input elements, time-based media with alternatives

- **1.4.3 Contrast (Minimum)** (Level AA)
  - Text and images of text must have a contrast ratio of at least **4.5:1** for normal text
  - Large text (18pt+ or 14pt+ bold) requires **3:1** contrast ratio
  - Ensures readability for users with visual impairments

### Operable

Ensures that user interface components and navigation are operable.

- **2.1.1 Keyboard** (Level A)
  - All functionality is operable via keyboard interface
  - No keyboard trap (users can exit using keyboard alone)
  - Applies to all visible interactive elements

- **2.1.4 Character Key Shortcuts** (Level A)
  - Keyboard shortcuts using only letters, numbers, punctuation, or symbols allow:
    - Ability to disable the shortcut, OR
    - Ability to remap to non-printable keys (Ctrl, Alt, etc.), OR
    - Shortcut only active when component has focus

- **2.2.1 Timing Adjustable** (Level A)
  - For any content time limits:
    - User can turn off the time limit, OR
    - User can adjust it over a wide range, OR
    - Time limit is essential (e.g., auction) and extension would invalidate it

- **2.3.1 Three Flashes or Below Threshold** (Level A)
  - Content must not flash more than **3 times per second**
  - Flash must be below general flash and red flash thresholds
  - Prevents seizures and physical reactions

- **2.4.3 Focus Order** (Level A)
  - If content can be navigated sequentially, navigation order preserves meaning
  - Focus order follows logical sequence
  - Critical for keyboard navigation

- **2.4.7 Focus Visible** (Level AA)
  - Keyboard operable UI has a visible keyboard focus indicator
  - Focus indicator must be obvious and distinguishable
  - Users must be able to see which element has focus

### Understandable

Ensures that information and operation of UI are understandable.

- **3.1.1 Language of Page** (Level A)
  - Default human language of page is programmatically determinable
  - Set via `lang` attribute on `<html>` tag

- **3.2.3 Consistent Navigation** (Level AA)
  - Repeated navigational mechanisms occur in the same order
  - Applies across multiple pages in a set
  - Users can rely on consistent structure

- **3.2.4 Consistent Identification** (Level AA)
  - Components with same functionality are identified consistently
  - Icon, button, or label appearance should be consistent
  - Reduces cognitive load for users

- **3.3.3 Error Suggestion** (Level AA)
  - If input error is detected and suggestions are known, provide them to user
  - Suggests valid input format
  - Helps users correct errors quickly

- **3.3.4 Error Prevention (Legal, Financial, Data)** (Level AA)
  - For pages requiring user data submission:
    - Submissions are reversible, OR
    - Errors are detected and user can correct, OR
    - Submissions are confirmed before finalization

### Robust

Ensures content is robust for interpretation by assistive technologies.

- **4.1.2 Name, Role, Value** (Level A)
  - For all user interface components:
    - Name and role can be programmatically determined
    - States and properties can be programmatically set
    - Notifications of changes available to assistive technologies
  - Essential for screen readers and voice control

- **4.1.3 Status Messages** (Level AA)
  - Status messages can be programmatically determined via role or properties
  - Presented to user by assistive technologies without receiving focus
  - Use ARIA live regions for dynamic updates

## External Resources

### Official Standards

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Official W3C WCAG 2.1 Quick Reference
- [WCAG 2.1 Standard](https://www.w3.org/TR/WCAG21/) - Complete WCAG 2.1 specification
- [Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/) - W3C's WAI homepage with comprehensive resources

### Learning Resources

- [WAI Tutorial](https://www.w3.org/WAI/tutorials/) - Practical tutorials on making web content accessible
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility) - Mozilla's comprehensive accessibility documentation
- [A11ycasts by Google Chrome](https://www.youtube.com/playlist?list=PLNYkxOF6rcICWx0C9Xc-RgEzwLvsPccay5) - Video series on accessibility topics
- [The A11Y Project](https://www.a11yproject.com/) - Community-driven accessibility resource

### Tools

- [axe DevTools](https://www.deque.com/axe/devtools/) - Browser extension for accessibility testing
- [WAVE](https://wave.webaim.org/) - WebAIM accessibility evaluation tool
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Built into Chrome DevTools, includes accessibility audits
- [Screen Reader Testing Tools](https://www.a11yproject.com/resources/#screenreaders) - Various screen readers for testing

### ARIA References

- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) - W3C's official guide to using ARIA
- [MDN ARIA Documentation](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) - Comprehensive ARIA reference
- [WAI-ARIA Roles, States, and Properties](https://www.w3.org/TR/wai-aria-1.2/) - Complete ARIA specification

### Color Contrast

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - Check color contrast ratios
- [Contrast Ratio Checker](https://contrast-ratio.com/) - Interactive contrast checker

## Tips for Implementation

### Keyboard Navigation

- Test with Tab and Shift+Tab keys
- Ensure logical tab order through components
- Use `:focus` and `:focus-visible` CSS pseudo-classes
- Never remove focus indicators without providing alternatives

### Color Contrast

- Use automated tools to check contrast ratios
- Test with real users who have color vision deficiency
- Don't rely on color alone to convey information
- Aim for WCAG AAA (7:1) when possible for better accessibility

### ARIA Attributes

- Use semantic HTML first (e.g., `<button>`, `<nav>`, `<main>`)
- Add ARIA only when native HTML isn't sufficient
- Common attributes: `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-live`, `role`
- Verify ARIA properties match actual component behavior

### Focus Management

- Keep focus in a logical order
- Use `tabindex="0"` only for components that should be focusable
- Avoid `tabindex="1"` and higher values
- Manage focus after dynamic content changes

## Testing Checklist

- [ ] Color contrast meets 4.5:1 for normal text
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicator is clearly visible
- [ ] Tab order follows logical flow
- [ ] ARIA attributes are used correctly
- [ ] Content works with screen readers
- [ ] Error messages are clear and actionable
- [ ] No content flashes more than 3 times per second
- [ ] Images have descriptive alt text
- [ ] Form labels are properly associated

## Further Learning

For team onboarding and deep dives into accessibility:

1. Start with [The A11Y Project checklist](https://www.a11yproject.com/checklist/)
2. Review [WAI tutorial examples](https://www.w3.org/WAI/tutorials/)
3. Practice with [WebAIM resources](https://webaim.org/)
4. Test components with real screen readers and keyboard navigation
5. Join accessibility communities and stay updated with best practices

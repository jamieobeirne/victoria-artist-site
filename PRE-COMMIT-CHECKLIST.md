# Pre-Commit Checklist — Victoria Ruiz Diaz

## 1. Code Quality
- [ ] No `console.log()` statements left in production code
- [ ] No commented-out code blocks
- [ ] Consistent indentation (2 spaces)
- [ ] No trailing whitespace

## 2. Accessibility
- [ ] All images have alt text
- [ ] Color contrast meets WCAG AA standards
- [ ] Keyboard navigation works
- [ ] Semantic HTML used correctly

## 3. Performance
- [ ] Images are optimized (under 200KB each)
- [ ] No render-blocking resources
- [ ] CSS/JS are minified
- [ ] No unused CSS classes

## 4. Spanish / Bilingual
- [ ] Spanish text is correct and consistent
- [ ] All UI strings are in Spanish (or bilingual toggle ready)
- [ ] No hardcoded English strings

## 5. Responsive Design
- [ ] Mobile (under 600px) ✓
- [ ] Tablet (600–1024px) ✓
- [ ] Desktop (1024px+) ✓
- [ ] No horizontal scroll

## 6. Git / Commit
- [ ] Commit message is clear and descriptive
- [ ] No `node_modules` or build artifacts committed
- [ ] No API keys or secrets in code
- [ ] Related changes are grouped in one commit

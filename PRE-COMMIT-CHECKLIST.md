# Pre-Commit Checklist — Victoria Ruiz Diaz

## 1. Code Quality
- [x] No `console.log()` statements left in production code
- [x] No commented-out code blocks
- [x] Consistent indentation (2 spaces)
- [x] No trailing whitespace

## 2. Accessibility
- [x] All images have alt text
- [x] Color contrast meets WCAG AA standards
- [x] Keyboard navigation works
- [x] Semantic HTML used correctly

## 3. Performance
- [x] Images are optimized (under 200KB each)
- [x] No render-blocking resources
- [ ] CSS/JS are minified
- [x] No unused CSS classes

## 4. Spanish / Bilingual
- [x] Spanish text is correct and consistent
- [x] All UI strings are in Spanish (or bilingual toggle ready)
- [x] No hardcoded English strings

## 5. Responsive Design
- [x] Mobile (under 600px) ✓
- [x] Tablet (600–1024px) ✓
- [x] Desktop (1024px+) ✓
- [ ] No horizontal scroll — needs manual browser check

## 6. Git / Commit
- [x] Commit message is clear and descriptive
- [x] No `node_modules` or build artifacts committed
- [x] No API keys or secrets in code
- [x] Related changes are grouped in one commit

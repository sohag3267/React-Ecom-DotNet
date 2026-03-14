# Customer Customization Guide - DebuggerMind

**Note:** This is a **premium commercial product** purchased from Envato Market. This guide helps you customize the application for your needs.

## ⚠️ Important Information

- **License:** This is NOT an open-source project
- **Redistribution:** You cannot resell or redistribute the source code
- **Usage Rights:** Based on your Envato license (Regular or Extended)
- **Support:** Available through Envato Market purchase page

## 🎨 Customization Guide

### 1. Branding & Styling

#### Update Logo and Favicon

Replace files in the `public/` directory:

- `favicon.ico` - Browser tab icon
- `logo.png` - Main logo
- `apple-touch-icon.png` - iOS home screen icon

#### Customize Colors

Edit `app/globals.css` to change theme colors:

```css
@layer base {
  :root {
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    /* Customize other colors */
  }
}
```

#### Update Site Metadata

Edit `app/layout.tsx` to change:

- Site title
- Meta description
- SEO keywords
- Open Graph tags

### 2. Configuration

#### Environment Variables

Update `.env.local` or `.env.production`:

```env
# Your Backend API
API_BASE_URL=https://your-api-endpoint.com
API_BASE_URL_V1=https://your-api-endpoint.com/api/v1

# Your Site URL
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=1234567890123456
```

#### Update Business Settings

Business information is fetched from your backend API. Configure:

- Store name
- Contact information
- Social media links
- Support hours
- Payment methods

### 3. Language & Translations

#### Add or Modify Languages

Translation files are in `app/i18n/locales/`:

```
locales/
├── en.json  # English
├── bn.json  # Bengali (default)
├── es.json  # Spanish
├── fr.json  # French
├── hi.json  # Hindi
└── ar.json  # Arabic
```

To add a new language:

1. Create `{language-code}.json` in `app/i18n/locales/`
2. Copy structure from `en.json`
3. Translate all keys
4. Import in `app/i18n/index.ts`

### 4. Features & Components

#### Customize Homepage Sections

Edit components in `app/components/home/`:

- `Hero.tsx` - Banner section
- `Features.tsx` - Feature highlights
- `ProductSection.tsx` - Product displays

#### Modify Product Display

Edit `app/components/product/`:

- `ProductCardItem.tsx` - Product card design
- `ProductFilters.tsx` - Filter options
- `ProductToolbar.tsx` - Search and sort

#### Customize Cart & Checkout

Edit files in:

- `app/(app-routes)/cart/` - Shopping cart
- `app/(app-routes)/checkout/` - Checkout flow

### 5. Payment Integration

Payment handling is done through your backend API. Frontend displays:

- Payment methods (configured in backend)
- Order confirmation
- Payment status pages

Customize payment status pages:

- `app/(app-routes)/(payment-status)/payment-success/`
- `app/(app-routes)/(payment-status)/payment-failed/`
- `app/(app-routes)/(payment-status)/payment-cancel/`

## 🔧 Development Workflow

### Making Changes

1. **Create a backup** of original files before modifying
2. **Test in development** mode first:
   ```bash
   npm run dev
   ```
3. **Check for errors**:
   ```bash
   npm run lint
   npm run type-check
   ```
4. **Build for production**:
   ```bash
   npm run build
   ```

### Code Style Guidelines

- **TypeScript**: Use types for all new code
- **Components**: Follow existing component structure
- **Naming**: Use descriptive names (camelCase for variables, PascalCase for components)
- **Comments**: Add comments for complex logic

### File Organization

```
app/
├── (app-routes)/      # Your pages
├── components/        # Reusable components
├── lib/              # Utilities
├── hooks/            # Custom hooks
└── store/            # State management
```

## 📝 Recommended Customizations

### Essential Changes

1. ✅ Update environment variables with your API
2. ✅ Replace logo and favicon
3. ✅ Customize colors and branding
4. ✅ Update site metadata (title, description)
5. ✅ Configure analytics (GA, Meta Pixel)

### Optional Enhancements

- Add custom product filters
- Modify checkout flow
- Create custom landing pages
- Add promotional banners
- Integrate additional payment methods
- Add customer reviews/ratings
- Implement loyalty program

## 🐛 Getting Help

### Before Requesting Support

1. **Read Documentation**: Check `DOCUMENTATION.html`
2. **Review Guides**: Read `QUICKSTART.md` and this guide
3. **Check Errors**: Look at browser console and terminal logs
4. **Test Build**: Ensure `npm run build` works

### Support Channels

- **Envato Support**: Open ticket through your purchase page
- **Documentation**: Comprehensive guide in `DOCUMENTATION.html`
- **Email**: Contact through Envato messaging system

### What to Include in Support Requests

1. **Purchase Code**: Your Envato purchase code
2. **Issue Description**: Clear description of the problem
3. **Steps to Reproduce**: How to recreate the issue
4. **Error Messages**: Any console or build errors
5. **Environment**: Node.js version, npm version, OS
6. **Screenshots**: Visual evidence if applicable

## ⚖️ License & Usage Rights

### What You CAN Do

- ✅ Use for client projects (with appropriate license)
- ✅ Customize and modify for your needs
- ✅ Create end products for yourself or clients
- ✅ Use in commercial projects (Extended License)

### What You CANNOT Do

- ❌ Resell or redistribute the source code
- ❌ Share with others who haven't purchased
- ❌ Create competing products
- ❌ Remove license/copyright notices
- ❌ Claim as your own work

See `LICENSE.txt` for complete legal terms.

## 📚 Additional Resources

- **Full Documentation**: `DOCUMENTATION.html`
- **Quick Start**: `QUICKSTART.md`
- **Deployment Guides**: `deployment/` directory
- **API Integration**: `.github/copilot-instructions.md`
- **Changelog**: `CHANGELOG.md`

## 🔒 Security Best Practices

When customizing:

- Never commit `.env.local` or `.env.production` to git
- Keep API credentials secure
- Use HTTPS in production
- Validate all user inputs
- Keep dependencies updated
- Follow Next.js security best practices

---

**DebuggerMind - Premium E-commerce Solution**

© 2025 DebuggerMind. All rights reserved. | Licensed via Envato Market

For support, contact through your [Envato purchase page](https://codecanyon.net)

## 📋 Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new files
- **ESLint**: Follow the project's ESLint configuration
- **Prettier**: Format code before committing
- **Naming**: Use descriptive, camelCase variable names

### Commit Messages

Follow conventional commits format:

```
type(scope): description

[optional body]
[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
git commit -m "feat(cart): add quantity increment buttons"
git commit -m "fix(auth): resolve token expiration issue"
git commit -m "docs(readme): update installation steps"
```

### File Organization

Follow the project's structure:

```
app/
├── (app-routes)/          # Route groups
├── components/            # React components
│   ├── shared/           # Reusable components
│   ├── pages/            # Page-level components
│   └── [feature]/        # Feature-specific components
├── lib/                   # Utilities and services
├── hooks/                 # Custom React hooks
└── store/                 # State management (Jotai)
```

### Component Guidelines

1. **Server Components by Default**: Use Server Components unless you need client-side interactivity
2. **Client Components**: Mark with `"use client"` only when needed
3. **Props Typing**: Always define TypeScript interfaces for props
4. **File Naming**: Use PascalCase for components (e.g., `ProductCard.tsx`)

Example component structure:

```typescript
"use client"; // Only if needed

import { useState } from "react";

interface ProductCardProps {
  title: string;
  price: number;
  onAddToCart?: () => void;
}

export function ProductCard({ title, price, onAddToCart }: ProductCardProps) {
  // Component logic
  return (
    // JSX
  );
}
```

### API Integration

Use the fluent `ApiClient` pattern:

```typescript
import { ApiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/api-route";

const response = await new ApiClient(API_ROUTES.PRODUCTS)
  .withMethod("GET")
  .withParams({ per_page: 12 })
  .execute<ProductsResponse>();
```

## 🧪 Testing

Before submitting:

1. **Build test**: Ensure production build works

   ```bash
   npm run build
   ```

2. **Type check**: No TypeScript errors

   ```bash
   npm run type-check
   ```

3. **Lint check**: Follow code standards

   ```bash
   npm run lint
   ```

4. **Manual testing**: Test your changes in the browser

## 📝 Pull Request Process

1. **Update documentation** if needed (README, DOCUMENTATION, etc.)
2. **Test thoroughly** in development mode
3. **Run all checks**:
   ```bash
   npm run lint
   npm run type-check
   npm run build
   ```
4. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Create Pull Request** on GitHub with:
   - Clear title describing the change
   - Detailed description of what was changed and why
   - Screenshots/videos for UI changes
   - Reference any related issues

### PR Title Format

```
type: brief description

Example:
feat: add product comparison feature
fix: resolve cart total calculation error
docs: update Docker deployment guide
```

### PR Description Template

```markdown
## Description

Brief description of the changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Changes Made

- List specific changes
- With bullet points

## Testing

- [ ] Tested in development
- [ ] Tested production build
- [ ] No TypeScript errors
- [ ] No ESLint warnings

## Screenshots (if applicable)

Add screenshots or videos

## Related Issues

Closes #123
```

## 🐛 Reporting Bugs

When reporting bugs, include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**: Numbered steps to reproduce
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**:
   - Node.js version
   - npm version
   - Browser (if applicable)
   - OS
6. **Screenshots**: If applicable
7. **Error Logs**: Console errors or build errors

## 💡 Feature Requests

When requesting features:

1. **Use Case**: Describe the problem this solves
2. **Proposed Solution**: How you envision it working
3. **Alternatives**: Other solutions you considered
4. **Additional Context**: Any other relevant information

## 📚 Documentation

- Update README.md for significant features
- Add JSDoc comments for complex functions
- Update CHANGELOG.md following Keep a Changelog format
- Include inline comments for complex logic

## ⚖️ Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other contributors

## 🔒 Security

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. Email the maintainers directly
3. Provide detailed information about the vulnerability
4. Allow time for a fix before public disclosure

## 📞 Getting Help

- Check existing documentation first
- Search for existing issues
- Ask in discussions for general questions
- Create an issue for bugs or feature requests

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project (see LICENSE.txt).

---

Thank you for contributing to DebuggerMind! 🎉

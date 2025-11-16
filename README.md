# ProfitPro - Professional Profit Calculator

A comprehensive, modern web application for calculating profits, margins, and financial metrics with advanced features including multi-currency support, interactive charts, history tracking, and PDF reporting.

## Features

### Core Functionality
- **Advanced Profit Calculations**
  - Total Cost calculation
  - Total Revenue calculation
  - Total Profit analysis
  - Profit Margin percentage
  - Final price after tax
  - Price after discount

### Input Options
- Cost Price
- Selling Price
- Quantity
- VAT/Tax Percentage (0-100%)
- Discount Percentage (0-100%)
- Shipping/Extra Fees
- Currency Selector (8+ currencies)

### Visual Features
- **Interactive Charts** (powered by Chart.js)
  - Cost vs Revenue bar chart
  - Profit distribution doughnut chart
  - Real-time updates
  - Theme-aware colors

- **Dark/Light Mode**
  - Persistent theme preference
  - Smooth transitions
  - Theme-aware charts

- **Responsive Design**
  - Mobile-first approach
  - Tablet optimized
  - Desktop enhanced
  - Touch-friendly interface

### Data Management
- **Calculation History**
  - Stores last 20 calculations
  - Persistent localStorage
  - Click to reload calculations
  - Clear history option
  - Timestamps for each entry

- **PDF Reports**
  - Detailed calculation reports
  - Professional formatting
  - Downloadable format
  - Timestamped documents

### Multi-Currency Support
- USD - US Dollar ($)
- EUR - Euro (€)
- GBP - British Pound (£)
- TND - Tunisian Dinar (د.ت)
- SAR - Saudi Riyal (﷼)
- CLP - Chilean Peso ($)
- JPY - Japanese Yen (¥)
- AUD - Australian Dollar (A$)

### User Interface
- **Navigation**
  - Home (Calculator)
  - About page
  - Contact page

- **Professional Design**
  - Modern gradient backgrounds
  - Smooth animations
  - Icon integration (Font Awesome)
  - Card-based layout
  - Hover effects
  - Focus states

### Input Validation
- Real-time error checking
- Visual feedback
- Error messages
- Minimum value constraints
- Auto-clear errors on input

## File Structure

```
newproject/
├── index.html          # Main HTML structure
├── styles.css          # Complete CSS with themes
├── script.js           # JavaScript functionality
└── README.md          # Documentation
```

## How to Use

### Basic Usage
1. Open `index.html` in a modern web browser
2. Select your preferred currency
3. Enter cost price, selling price, and quantity
4. (Optional) Add VAT/Tax, discount, and shipping fees
5. Click "Calculate" or press Enter
6. View results, charts, and download PDF if needed

### Navigation
- **Home**: Main calculator interface
- **About**: Information about ProfitPro
- **Contact**: Contact form and information

### Theme Toggle
- Click the moon/sun icon in the navigation bar
- Theme preference is saved automatically
- Charts update to match theme

### History
- All calculations are automatically saved
- Click any history item to reload that calculation
- Use "Clear History" to remove all saved calculations
- History stores the last 20 calculations

### PDF Reports
- Click "Download PDF Report" after calculating
- PDF includes all input values and results
- File is automatically timestamped

## Technical Details

### Dependencies
- **Chart.js** (v4.x) - Data visualization
- **jsPDF** (v2.5.1) - PDF generation
- **Font Awesome** (v6.4.0) - Icons

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Modern mobile browsers

### Storage
- Uses localStorage for:
  - Theme preference
  - Calculation history
- No server required
- No external API calls

## Calculations Explained

### Total Cost
```
Total Cost = (Cost Price × Quantity) + Shipping/Fees
```

### Total Revenue
```
Total Revenue = Selling Price × Quantity
```

### Price After Discount
```
Discount Amount = Total Revenue × (Discount % ÷ 100)
Price After Discount = Total Revenue - Discount Amount
```

### Final Price (After Tax)
```
Tax Amount = Price After Discount × (VAT % ÷ 100)
Final Price = Price After Discount + Tax Amount
```

### Total Profit
```
Total Profit = Final Price - Total Cost
```

### Profit Margin
```
Profit Margin % = (Total Profit ÷ Final Price) × 100
```

## Customization

### Changing Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --success-color: #10b981;
    --danger-color: #ef4444;
}
```

### Adding Currencies
Add new options in `index.html`:
```html
<option value="NEW" data-symbol="SYMBOL">NEW - Currency Name</option>
```

### Modifying History Limit
Change in `script.js`:
```javascript
if (calculationHistory.length > 20) {  // Change 20 to your desired limit
```

## Features in Detail

### Light/Dark Mode
- Automatic icon change (moon/sun)
- All UI elements adapt
- Charts change colors
- Persistent across sessions

### Responsive Breakpoints
- Mobile: < 480px
- Tablet: 480px - 768px
- Desktop: 768px - 1024px
- Large Desktop: > 1024px

### Animations
- Fade-in on page load
- Slide-in for results
- Hover effects on cards
- Pulse animation on profit highlights
- Smooth theme transitions

## Contact Information

For support or inquiries:
- Email: support@profitpro.com
- Phone: +1 (555) 123-4567
- Location: 123 Business Ave, Suite 100, New York, NY 10001

## Credits

Developed with modern web technologies:
- HTML5
- CSS3 (Flexbox, Grid, Variables)
- Vanilla JavaScript (ES6+)
- Chart.js
- jsPDF
- Font Awesome

## License

© 2024 ProfitPro. All rights reserved.

---

**Enjoy using ProfitPro!** For feedback or feature requests, please use the contact form.
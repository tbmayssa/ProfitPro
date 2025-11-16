// ===== Global Variables =====
let currentTheme = localStorage.getItem('theme') || 'light';
let calculationHistory = JSON.parse(localStorage.getItem('history')) || [];
let currentCalculation = null;
let costRevenueChart = null;
let profitChart = null;

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeNavigation();
    loadHistory();
    setupEventListeners();
});

// ===== Theme Management =====
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();

    // Update charts if they exist
    if (costRevenueChart) updateCharts();
}

function updateThemeIcon() {
    const icon = document.querySelector('#themeToggle i');
    icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// ===== Navigation =====
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            navigateToSection(targetId);
        });
    });
}

function navigateToSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update nav links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Event Listeners =====
function setupEventListeners() {
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Auto-calculate on input change
    const inputs = ['costPrice', 'sellingPrice', 'quantity', 'vat', 'discount', 'shipping'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', () => {
                clearErrorState(id);
            });
        }
    });

    // Enter key to calculate
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && document.getElementById('home').classList.contains('active')) {
            calculateProfit();
        }
    });
}

// ===== Input Validation =====
function validateInputs() {
    let isValid = true;
    const errors = [];

    const costPrice = parseFloat(document.getElementById('costPrice').value);
    const sellingPrice = parseFloat(document.getElementById('sellingPrice').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!costPrice || costPrice < 0) {
        showError('costPrice', 'costError');
        errors.push('Invalid cost price');
        isValid = false;
    }

    if (!sellingPrice || sellingPrice < 0) {
        showError('sellingPrice', 'sellingError');
        errors.push('Invalid selling price');
        isValid = false;
    }

    if (!quantity || quantity < 1) {
        showError('quantity', 'quantityError');
        errors.push('Quantity must be at least 1');
        isValid = false;
    }

    return isValid;
}

function showError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.add('error');
    if (error) error.classList.add('show');
}

function clearErrorState(inputId) {
    const input = document.getElementById(inputId);
    const errorMap = {
        'costPrice': 'costError',
        'sellingPrice': 'sellingError',
        'quantity': 'quantityError'
    };

    if (input) input.classList.remove('error');
    const errorId = errorMap[inputId];
    if (errorId) {
        const error = document.getElementById(errorId);
        if (error) error.classList.remove('show');
    }
}

// ===== Calculate Profit =====
function calculateProfit() {
    // Clear all errors first
    ['costPrice', 'sellingPrice', 'quantity'].forEach(id => clearErrorState(id));

    if (!validateInputs()) {
        return;
    }

    // Get input values
    const costPrice = parseFloat(document.getElementById('costPrice').value);
    const sellingPrice = parseFloat(document.getElementById('sellingPrice').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    const vat = parseFloat(document.getElementById('vat').value) || 0;
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const shipping = parseFloat(document.getElementById('shipping').value) || 0;
    const currency = document.getElementById('currency');
    const currencySymbol = currency.options[currency.selectedIndex].getAttribute('data-symbol');

    // Calculate totals
    const totalCost = (costPrice * quantity) + shipping;
    const totalRevenue = sellingPrice * quantity;

    // Calculate price after discount
    const discountAmount = (totalRevenue * discount) / 100;
    const priceAfterDiscount = totalRevenue - discountAmount;

    // Calculate price after tax
    const taxAmount = (priceAfterDiscount * vat) / 100;
    const finalPrice = priceAfterDiscount + taxAmount;

    // Calculate profit (final price - total cost)
    const totalProfit = finalPrice - totalCost;
    const profitMargin = finalPrice > 0 ? (totalProfit / finalPrice) * 100 : 0;

    // Store current calculation
    currentCalculation = {
        costPrice,
        sellingPrice,
        quantity,
        vat,
        discount,
        shipping,
        currency: currency.value,
        currencySymbol,
        totalCost,
        totalRevenue,
        priceAfterDiscount,
        finalPrice,
        totalProfit,
        profitMargin,
        timestamp: new Date().toISOString()
    };

    // Display results
    displayResults(currentCalculation);

    // Update charts
    updateCharts();

    // Add to history
    addToHistory(currentCalculation);

    // Show results card with animation
    const resultsCard = document.getElementById('resultsCard');
    resultsCard.style.display = 'block';

    // Show charts
    document.getElementById('chartsContainer').classList.add('show');
}

// ===== Display Results =====
function displayResults(calc) {
    const { currencySymbol, totalCost, totalRevenue, totalProfit, profitMargin, finalPrice, priceAfterDiscount } = calc;

    document.getElementById('totalCost').textContent = `${currencySymbol}${totalCost.toFixed(2)}`;
    document.getElementById('totalRevenue').textContent = `${currencySymbol}${totalRevenue.toFixed(2)}`;
    document.getElementById('totalProfit').textContent = `${currencySymbol}${totalProfit.toFixed(2)}`;
    document.getElementById('profitMargin').textContent = `${profitMargin.toFixed(2)}%`;
    document.getElementById('finalPrice').textContent = `${currencySymbol}${finalPrice.toFixed(2)}`;
    document.getElementById('afterDiscount').textContent = `${currencySymbol}${priceAfterDiscount.toFixed(2)}`;

    // Color code profit
    const profitElement = document.getElementById('totalProfit');
    const marginElement = document.getElementById('profitMargin');

    if (totalProfit >= 0) {
        profitElement.classList.add('positive');
        profitElement.classList.remove('negative');
        marginElement.classList.add('positive');
        marginElement.classList.remove('negative');
    } else {
        profitElement.classList.add('negative');
        profitElement.classList.remove('positive');
        marginElement.classList.add('negative');
        marginElement.classList.remove('positive');
    }
}

// ===== Reset Calculator =====
function resetCalculator() {
    // Clear all inputs
    document.getElementById('costPrice').value = '';
    document.getElementById('sellingPrice').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('vat').value = '0';
    document.getElementById('discount').value = '0';
    document.getElementById('shipping').value = '0';
    document.getElementById('currency').selectedIndex = 0;

    // Clear errors
    ['costPrice', 'sellingPrice', 'quantity'].forEach(id => clearErrorState(id));

    // Hide results
    document.getElementById('resultsCard').style.display = 'none';
    document.getElementById('chartsContainer').classList.remove('show');

    // Clear current calculation
    currentCalculation = null;

    // Destroy charts
    if (costRevenueChart) {
        costRevenueChart.destroy();
        costRevenueChart = null;
    }
    if (profitChart) {
        profitChart.destroy();
        profitChart = null;
    }
}

// ===== Charts =====
function updateCharts() {
    if (!currentCalculation) return;

    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#d1d5db' : '#6b7280';
    const gridColor = isDark ? '#374151' : '#e5e7eb';

    // Destroy existing charts
    if (costRevenueChart) costRevenueChart.destroy();
    if (profitChart) profitChart.destroy();

    // Cost vs Revenue Chart (Bar Chart)
    const ctx1 = document.getElementById('costRevenueChart').getContext('2d');
    costRevenueChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['Total Cost', 'Total Revenue', 'Final Price'],
            datasets: [{
                label: 'Amount',
                data: [
                    currentCalculation.totalCost,
                    currentCalculation.totalRevenue,
                    currentCalculation.finalPrice
                ],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.6)',
                    'rgba(99, 102, 241, 0.6)',
                    'rgba(16, 185, 129, 0.6)'
                ],
                borderColor: [
                    'rgba(239, 68, 68, 1)',
                    'rgba(99, 102, 241, 1)',
                    'rgba(16, 185, 129, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return currentCalculation.currencySymbol + value.toFixed(0);
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });

    // Profit Distribution Chart (Doughnut Chart)
    const ctx2 = document.getElementById('profitChart').getContext('2d');
    const profit = Math.max(0, currentCalculation.totalProfit);
    const cost = currentCalculation.totalCost;

    profitChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ['Cost', 'Profit'],
            datasets: [{
                data: [cost, profit],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.6)',
                    'rgba(16, 185, 129, 0.6)'
                ],
                borderColor: [
                    'rgba(239, 68, 68, 1)',
                    'rgba(16, 185, 129, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: textColor,
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// ===== History Management =====
function addToHistory(calculation) {
    calculationHistory.unshift({
        ...calculation,
        id: Date.now()
    });

    // Keep only last 20 calculations
    if (calculationHistory.length > 20) {
        calculationHistory = calculationHistory.slice(0, 20);
    }

    saveHistory();
    displayHistory();
}

function saveHistory() {
    localStorage.setItem('history', JSON.stringify(calculationHistory));
}

function loadHistory() {
    displayHistory();
}

function displayHistory() {
    const historyList = document.getElementById('historyList');

    if (calculationHistory.length === 0) {
        historyList.innerHTML = '<p class="empty-state">No calculations yet. Start calculating to see history.</p>';
        return;
    }

    historyList.innerHTML = calculationHistory.map(calc => {
        const date = new Date(calc.timestamp);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        const profitClass = calc.totalProfit >= 0 ? 'positive' : 'negative';

        return `
            <div class="history-item" onclick="loadCalculation(${calc.id})">
                <div class="history-date">${formattedDate}</div>
                <div class="history-details">
                    <div class="history-detail">
                        <strong>Currency:</strong> ${calc.currency}
                    </div>
                    <div class="history-detail">
                        <strong>Quantity:</strong> ${calc.quantity}
                    </div>
                    <div class="history-detail">
                        <strong>Cost:</strong> ${calc.currencySymbol}${calc.costPrice.toFixed(2)}
                    </div>
                    <div class="history-detail">
                        <strong>Selling:</strong> ${calc.currencySymbol}${calc.sellingPrice.toFixed(2)}
                    </div>
                    <div class="history-detail">
                        <strong>Profit:</strong> <span class="${profitClass}">${calc.currencySymbol}${calc.totalProfit.toFixed(2)}</span>
                    </div>
                    <div class="history-detail">
                        <strong>Margin:</strong> <span class="${profitClass}">${calc.profitMargin.toFixed(2)}%</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function loadCalculation(id) {
    const calculation = calculationHistory.find(calc => calc.id === id);
    if (!calculation) return;

    // Load values into form
    document.getElementById('costPrice').value = calculation.costPrice;
    document.getElementById('sellingPrice').value = calculation.sellingPrice;
    document.getElementById('quantity').value = calculation.quantity;
    document.getElementById('vat').value = calculation.vat;
    document.getElementById('discount').value = calculation.discount;
    document.getElementById('shipping').value = calculation.shipping;

    // Set currency
    const currencySelect = document.getElementById('currency');
    for (let i = 0; i < currencySelect.options.length; i++) {
        if (currencySelect.options[i].value === calculation.currency) {
            currencySelect.selectedIndex = i;
            break;
        }
    }

    // Navigate to home and recalculate
    navigateToSection('home');
    setTimeout(() => {
        calculateProfit();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all calculation history?')) {
        calculationHistory = [];
        saveHistory();
        displayHistory();
    }
}

// ===== PDF Generation =====
function downloadPDF() {
    if (!currentCalculation) {
        alert('Please calculate first before downloading the report.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const calc = currentCalculation;
    const date = new Date(calc.timestamp);
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(99, 102, 241);
    doc.text('ProfitPro - Calculation Report', 20, 20);

    // Date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${formattedDate}`, 20, 28);

    // Line
    doc.setDrawColor(99, 102, 241);
    doc.line(20, 32, 190, 32);

    // Input Details
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Input Details', 20, 42);

    doc.setFontSize(11);
    doc.setTextColor(60);
    let y = 50;
    doc.text(`Currency: ${calc.currency}`, 20, y);
    y += 7;
    doc.text(`Cost Price: ${calc.currencySymbol}${calc.costPrice.toFixed(2)}`, 20, y);
    y += 7;
    doc.text(`Selling Price: ${calc.currencySymbol}${calc.sellingPrice.toFixed(2)}`, 20, y);
    y += 7;
    doc.text(`Quantity: ${calc.quantity}`, 20, y);
    y += 7;
    doc.text(`VAT/Tax: ${calc.vat}%`, 20, y);
    y += 7;
    doc.text(`Discount: ${calc.discount}%`, 20, y);
    y += 7;
    doc.text(`Shipping/Fees: ${calc.currencySymbol}${calc.shipping.toFixed(2)}`, 20, y);

    // Results
    y += 15;
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Calculation Results', 20, y);

    y += 10;
    doc.setFontSize(11);
    doc.setTextColor(60);
    doc.text(`Total Cost: ${calc.currencySymbol}${calc.totalCost.toFixed(2)}`, 20, y);
    y += 7;
    doc.text(`Total Revenue: ${calc.currencySymbol}${calc.totalRevenue.toFixed(2)}`, 20, y);
    y += 7;
    doc.text(`Price After Discount: ${calc.currencySymbol}${calc.priceAfterDiscount.toFixed(2)}`, 20, y);
    y += 7;
    doc.text(`Final Price (After Tax): ${calc.currencySymbol}${calc.finalPrice.toFixed(2)}`, 20, y);

    y += 10;
    doc.setFontSize(12);
    const profitColor = calc.totalProfit >= 0 ? [16, 185, 129] : [239, 68, 68];
    doc.setTextColor(...profitColor);
    doc.text(`Total Profit: ${calc.currencySymbol}${calc.totalProfit.toFixed(2)}`, 20, y);
    y += 7;
    doc.text(`Profit Margin: ${calc.profitMargin.toFixed(2)}%`, 20, y);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text('Generated by ProfitPro - Professional Profit Calculator', 20, 280);

    // Save PDF
    doc.save(`ProfitPro_Report_${Date.now()}.pdf`);
}

// ===== Contact Form =====
function handleContactSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;

    // In a real application, you would send this to a server
    console.log('Contact Form Submitted:', { name, email, subject, message });

    // Show success message
    alert('Thank you for your message! We will get back to you soon.');

    // Reset form
    event.target.reset();

    return false;
}
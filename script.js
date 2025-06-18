// Supabase 설정
const SUPABASE_URL = 'https://dcwnogwgzlrmaeapokfe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjd25vZ3dnemxybWFlYXBva2ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMjMwODEsImV4cCI6MjA2NTc5OTA4MX0.sWT73zGFfVnUzIFTVRKXajOWpQTYCBDuK_iYGM9JFVE';

// Supabase 클라이언트 초기화
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM 요소 참조
const subscriptionForm = document.getElementById('subscriptionForm');
const emailInput = document.getElementById('email');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.querySelector('.btn-text');
const btnLoading = document.querySelector('.btn-loading');
const successMessage = document.getElementById('successMessage');

// 이메일 유효성 검사 함수
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 로딩 상태 토글 함수
function toggleLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
    } else {
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
    }
}

// 성공 메시지 표시 함수
function showSuccessMessage() {
    subscriptionForm.classList.add('hidden');
    successMessage.classList.remove('hidden');
    
    // 5초 후 페이지를 새로고침하여 다시 구독할 수 있도록 함
    setTimeout(() => {
        subscriptionForm.classList.remove('hidden');
        successMessage.classList.add('hidden');
        emailInput.value = '';
    }, 5000);
}

// 에러 메시지 표시 함수
function showErrorMessage(message) {
    // 기존 에러 메시지 제거
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // 새 에러 메시지 생성
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        margin-top: 16px;
        text-align: center;
        font-weight: 500;
    `;
    errorDiv.textContent = message;
    
    subscriptionForm.appendChild(errorDiv);
    
    // 5초 후 에러 메시지 제거
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// 이메일 구독 처리 함수
async function handleSubscription(email) {
    try {
        // Supabase에 이메일 저장
        const { data, error } = await supabaseClient
            .from('newsletter_subscribers')
            .insert([
                { 
                    email: email,
                    subscribed_at: new Date().toISOString(),
                    is_active: true
                }
            ])
            .select();

        if (error) {
            // 중복 이메일 체크
            if (error.code === '23505') {
                throw new Error('이미 구독된 이메일 주소입니다.');
            }
            throw new Error('구독 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        }

        console.log('구독 성공:', data);
        return true;
    } catch (error) {
        console.error('구독 오류:', error);
        throw error;
    }
}

// 폼 제출 이벤트 리스너
subscriptionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    // 이메일 유효성 검사
    if (!email) {
        showErrorMessage('이메일 주소를 입력해주세요.');
        return;
    }
    
    if (!isValidEmail(email)) {
        showErrorMessage('올바른 이메일 주소를 입력해주세요.');
        return;
    }
    
    // 로딩 시작
    toggleLoading(true);
    
    try {
        // 이메일 구독 처리
        await handleSubscription(email);
        
        // 성공 메시지 표시
        showSuccessMessage();
        
        // Google Analytics 이벤트 (있는 경우)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'newsletter_signup', {
                'event_category': 'engagement',
                'event_label': 'newsletter'
            });
        }
        
    } catch (error) {
        showErrorMessage(error.message);
    } finally {
        // 로딩 종료
        toggleLoading(false);
    }
});

// CTA 폼 연동
const ctaEmail = document.getElementById('ctaEmail');
const ctaSubmit = document.getElementById('ctaSubmit');

if (ctaEmail && ctaSubmit) {
    ctaSubmit.addEventListener('click', () => {
        const email = ctaEmail.value.trim();
        if (email) {
            emailInput.value = email;
            // 메인 폼으로 스크롤
            subscriptionForm.scrollIntoView({ behavior: 'smooth' });
            // 메인 폼의 이메일 입력 필드에 포커스
            setTimeout(() => {
                emailInput.focus();
            }, 500);
        }
    });
}

// 실시간 이메일 입력 검증
function validateEmailInput(input) {
    const email = input.value.trim();
    const isValid = isValidEmail(email);
    
    if (email && !isValid) {
        input.classList.add('border-red-500');
        input.classList.remove('border-gray-300', 'focus:border-blue-500');
    } else {
        input.classList.remove('border-red-500');
        input.classList.add('border-gray-300');
    }
}

emailInput.addEventListener('input', (e) => validateEmailInput(e.target));
if (ctaEmail) {
    ctaEmail.addEventListener('input', (e) => validateEmailInput(e.target));
}

// 엔터 키 이벤트 리스너
emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        subscriptionForm.dispatchEvent(new Event('submit'));
    }
});

// 페이지 로드 시 애니메이션 효과
document.addEventListener('DOMContentLoaded', () => {
    // 페이지 요소들을 순차적으로 나타나게 함
    const animatedElements = document.querySelectorAll('.hero-content, .preview-card, .stat-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// 통계 카운터 애니메이션
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // 숫자 포맷팅
        if (target >= 1000) {
            element.textContent = Math.floor(current / 1000) + 'K+';
        } else {
            element.textContent = Math.floor(current) + '%';
        }
    }, 16);
}

// 통계 섹션이 보일 때 카운터 애니메이션 실행
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach((el, index) => {
                const targets = [10000, 50, 95]; // 실제 통계 값
                animateCounter(el, targets[index]);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    statsObserver.observe(statsSection);
} 
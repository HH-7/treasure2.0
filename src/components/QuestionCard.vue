<template>
  <div class="question-card">
    <div class="question-header">
      <div class="level-badge">第 {{ level }} 关</div>
      <div class="points">{{ question.points }} 分</div>
    </div>
    
    <div class="question-content">
      <h3 class="question-text">{{ question.question }}</h3>
    </div>
    
    <div class="options-container">
      <button
        v-for="(option, index) in question.options"
        :key="index"
        @click="selectAnswer(index)"
        class="option-button"
        :class="{
          'selected': selectedAnswer === index,
          'correct': showResult && index === question.answer,
          'incorrect': showResult && selectedAnswer === index && index !== question.answer
        }"
        :disabled="showResult"
      >
        <span class="option-label">{{ String.fromCharCode(65 + index) }}</span>
        <span class="option-text">{{ option }}</span>
        <span v-if="showResult && index === question.answer" class="result-icon">✓</span>
        <span v-if="showResult && selectedAnswer === index && index !== question.answer" class="result-icon">✗</span>
      </button>
    </div>
    
    <div v-if="showResult" class="result-message" :class="{ 'correct': isCorrect, 'incorrect': !isCorrect }">
      <span v-if="isCorrect">🎉 回答正确！+{{ question.points }} 分</span>
      <span v-else>😢 回答错误，正确答案是 {{ String.fromCharCode(65 + question.answer) }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  level: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['answer'])

const selectedAnswer = ref(null)
const showResult = ref(false)
const isCorrect = ref(false)

const selectAnswer = (index) => {
  if (showResult.value) return
  
  selectedAnswer.value = index
  showResult.value = true
  isCorrect.value = index === props.question.answer
  
  emit('answer', index)
}
</script>

<style scoped>
.question-card {
  background: linear-gradient(135deg, #161b26 0%, #1a1f2e 100%);
  border: 2px solid rgba(74, 222, 128, 0.4);
  border-radius: 20px;
  padding: 35px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(74, 222, 128, 0.2);
  animation: bounce-in 0.5s;
  position: relative;
  overflow: hidden;
}

.question-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(74, 222, 128, 0.05) 0%, transparent 70%);
  animation: float 8s ease-in-out infinite;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  position: relative;
  z-index: 1;
}

.level-badge {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #0a0e1a;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 800;
  font-size: 0.95rem;
  box-shadow: 0 0 15px rgba(74, 222, 128, 0.5);
  border: 2px solid rgba(74, 222, 128, 0.5);
}

.points {
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.3), rgba(34, 197, 94, 0.3));
  border: 2px solid #4ade80;
  color: #4ade80;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 800;
  font-size: 0.95rem;
  box-shadow: 0 0 20px rgba(74, 222, 128, 0.5);
  text-shadow: 0 0 10px rgba(74, 222, 128, 0.8);
}

.question-content {
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
}

.question-text {
  color: #e2e8f0;
  font-size: 1.5rem;
  line-height: 1.6;
  text-align: center;
  text-shadow: 0 0 10px rgba(74, 222, 128, 0.2);
  font-weight: 600;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.option-button {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 18px 25px;
  background: linear-gradient(135deg, rgba(22, 27, 38, 0.8), rgba(26, 31, 46, 0.8));
  border: 2px solid rgba(148, 163, 184, 0.3);
  border-radius: 12px;
  text-align: left;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.option-button:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(26, 31, 46, 0.9), rgba(30, 35, 50, 0.9));
  border-color: rgba(74, 222, 128, 0.6);
  transform: translateX(10px);
  box-shadow: 0 0 15px rgba(74, 222, 128, 0.3);
}

.option-button.selected {
  border-color: rgba(74, 222, 128, 0.6);
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.1), rgba(34, 197, 94, 0.1));
  box-shadow: 0 0 15px rgba(74, 222, 128, 0.3);
}

.option-button.correct {
  border-color: #10b981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2));
  box-shadow: 0 0 25px rgba(16, 185, 129, 0.5);
  animation: pulse 0.5s;
}

.option-button.incorrect {
  border-color: #ef4444;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2));
  box-shadow: 0 0 25px rgba(239, 68, 68, 0.5);
  animation: shake 0.5s;
}

.option-button:disabled {
  cursor: not-allowed;
  opacity: 0.9;
}

.option-label {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #0a0e1a;
  border-radius: 50%;
  font-weight: 800;
  flex-shrink: 0;
  box-shadow: 0 0 15px rgba(74, 222, 128, 0.5);
}

.option-button.correct .option-label {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.7);
}

.option-button.incorrect .option-label {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.7);
}

.option-text {
  flex: 1;
  color: #e2e8f0;
  font-weight: 500;
}

.result-icon {
  font-size: 1.5rem;
  font-weight: bold;
  filter: drop-shadow(0 0 5px currentColor);
}

.result-message {
  text-align: center;
  padding: 20px;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 700;
  animation: bounce-in 0.5s;
  position: relative;
  z-index: 1;
  border: 2px solid;
}

.result-message.correct {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2));
  border-color: #10b981;
  color: #6ee7b7;
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.5);
}

.result-message.incorrect {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2));
  border-color: #ef4444;
  color: #fca5a5;
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.5);
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@media (max-width: 768px) {
  .question-card {
    padding: 25px 20px;
  }
  
  .question-text {
    font-size: 1.2rem;
  }
  
  .option-button {
    padding: 15px 20px;
    font-size: 1rem;
  }
}
</style>
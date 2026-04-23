# GitHub Pages 배포 가이드

이 프로젝트를 GitHub Pages로 배포하는 방법입니다.

## 1단계: GitHub 저장소 설정

1. `https://github.com/Taolee-crypto/k-back` 저장소로 이동
2. **Settings** → **Pages** 탭 클릭
3. **Source** 섹션에서 **Deploy from a branch** 선택
4. **Branch** 드롭다운에서 `main` (또는 `master`) 선택
5. **Folder** 드롭다운에서 `/ (root)` 선택
6. **Save** 클릭

## 2단계: 저장소에 코드 푸시

```bash
cd /home/ubuntu/incheon-circular-economy

# 기존 원격 저장소 확인
git remote -v

# 원격 저장소 URL 설정 (아직 설정되지 않았다면)
git remote add origin https://github.com/Taolee-crypto/k-back.git
# 또는 기존 URL 변경
git remote set-url origin https://github.com/Taolee-crypto/k-back.git

# 코드 푸시
git add .
git commit -m "Deploy incheon circular economy simulator to GitHub Pages"
git push -u origin main
```

## 3단계: 자동 배포 확인

1. GitHub 저장소의 **Actions** 탭 확인
2. "Deploy to GitHub Pages" 워크플로우 실행 대기
3. 완료되면 `https://taolee-crypto.github.io/k-back/` 에서 접속 가능

## 주요 설정 파일

- **vite.config.ts**: `base: "/k-back/"` 설정으로 서브 경로 배포 지원
- **.github/workflows/deploy.yml**: 자동 배포 워크플로우
- **package.json**: `pnpm run build` 명령어로 정적 파일 생성

## 배포 후 확인

- 프로젝트 빌드 결과: `/dist/public/` 디렉토리
- 배포 URL: `https://taolee-crypto.github.io/k-back/`
- 모든 리소스 경로는 자동으로 `/k-back/` 기반으로 조정됨

## 문제 해결

### 배포 후 페이지가 안 뜨는 경우
1. GitHub Pages 설정에서 **Branch**가 올바르게 설정되었는지 확인
2. **Actions** 탭에서 배포 워크플로우 로그 확인
3. 브라우저 캐시 삭제 후 재접속

### CSS/JS가 로드되지 않는 경우
- `vite.config.ts`의 `base` 설정이 `/k-back/`으로 되어 있는지 확인
- 환경 변수 `GITHUB_PAGES=true`로 빌드되었는지 확인

## 로컬 테스트

GitHub Pages 배포 전 로컬에서 테스트:

```bash
# 프로덕션 빌드
GITHUB_PAGES=true pnpm run build

# 빌드 결과 미리보기 (선택사항)
pnpm run preview
```

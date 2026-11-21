# Contrato esperado: adesão de prefeituras

O frontend de adesão está preparado para os endpoints abaixo. Eles ainda não
foram encontrados no monólito durante a auditoria e, por isso, nenhuma ação é
simulada localmente.

## Solicitação pública

- `POST /prefecture-applications`
  - Body: `PrefectureApplicationForm`
  - Response: `{ id: string, protocol: string }`
- `POST /prefecture-applications/{applicationId}/documents`
  - Multipart: campo `file`
- `GET /prefecture-applications/public/{token}`
  - Response: `PrefectureApplicationDetails`, com somente histórico e mensagem
    públicos.

## Gestão SUPERUSER

- `GET /prefecture-applications/stats`
- `GET /prefecture-applications?status=&search=&page=&size=`
- `GET /prefecture-applications/{applicationId}`
- `POST /prefecture-applications/{applicationId}/approve`
- `POST /prefecture-applications/{applicationId}/reject`
  - Body: `{ justification: string }`
- `POST /prefecture-applications/{applicationId}/additional-information`
  - Body: `{ message: string }`
- `POST /prefecture-applications/{applicationId}/notes`
  - Body: `{ content: string }`

## Convite

- `GET /prefecture-invitations/{token}`
- `POST /prefecture-invitations/activate`
  - Body: `{ token: string, password: string }`
  - Response: `{ accessToken: string }`

Os status usados são `UNDER_ANALYSIS`, `ADDITIONAL_INFO_REQUIRED`, `APPROVED`
e `REJECTED`. Os tipos completos estão em
`src/types/PrefectureApplication.ts`.

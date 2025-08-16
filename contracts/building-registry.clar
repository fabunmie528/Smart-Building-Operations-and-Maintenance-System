;; Smart Building Registry Contract
;; Manages building registration, ownership, and basic metadata

;; Constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-BUILDING-EXISTS (err u101))
(define-constant ERR-BUILDING-NOT-FOUND (err u102))
(define-constant ERR-INVALID-INPUT (err u103))

;; Data Variables
(define-data-var next-building-id uint u1)

;; Data Maps
(define-map buildings
  { building-id: uint }
  {
    owner: principal,
    manager: principal,
    name: (string-ascii 100),
    address: (string-ascii 200),
    total-units: uint,
    building-type: (string-ascii 50),
    construction-year: uint,
    total-area: uint,
    status: (string-ascii 20),
    created-at: uint
  }
)

(define-map building-managers
  { building-id: uint, manager: principal }
  { authorized: bool, added-at: uint }
)

(define-map owner-buildings
  { owner: principal }
  { building-ids: (list 100 uint) }
)

;; Public Functions

;; Register a new building
(define-public (register-building
  (name (string-ascii 100))
  (address (string-ascii 200))
  (total-units uint)
  (building-type (string-ascii 50))
  (construction-year uint)
  (total-area uint))
  (let ((building-id (var-get next-building-id)))
    (asserts! (> (len name) u0) ERR-INVALID-INPUT)
    (asserts! (> (len address) u0) ERR-INVALID-INPUT)
    (asserts! (> total-units u0) ERR-INVALID-INPUT)
    (asserts! (> total-area u0) ERR-INVALID-INPUT)
    (asserts! (>= construction-year u1900) ERR-INVALID-INPUT)
    (asserts! (<= construction-year u2030) ERR-INVALID-INPUT)

    (map-set buildings
      { building-id: building-id }
      {
        owner: tx-sender,
        manager: tx-sender,
        name: name,
        address: address,
        total-units: total-units,
        building-type: building-type,
        construction-year: construction-year,
        total-area: total-area,
        status: "active",
        created-at: block-height
      }
    )

    (map-set building-managers
      { building-id: building-id, manager: tx-sender }
      { authorized: true, added-at: block-height }
    )

    (let ((current-buildings (default-to (list) (get building-ids (map-get? owner-buildings { owner: tx-sender })))))
      (map-set owner-buildings
        { owner: tx-sender }
        { building-ids: (unwrap! (as-max-len? (append current-buildings building-id) u100) ERR-INVALID-INPUT) }
      )
    )

    (var-set next-building-id (+ building-id u1))
    (ok building-id)
  )
)

;; Add a building manager
(define-public (add-manager (building-id uint) (manager principal))
  (let ((building (unwrap! (map-get? buildings { building-id: building-id }) ERR-BUILDING-NOT-FOUND)))
    (asserts! (is-eq tx-sender (get owner building)) ERR-NOT-AUTHORIZED)
    (asserts! (not (is-eq manager (get owner building))) ERR-INVALID-INPUT)

    (map-set building-managers
      { building-id: building-id, manager: manager }
      { authorized: true, added-at: block-height }
    )
    (ok true)
  )
)

;; Remove a building manager
(define-public (remove-manager (building-id uint) (manager principal))
  (let ((building (unwrap! (map-get? buildings { building-id: building-id }) ERR-BUILDING-NOT-FOUND)))
    (asserts! (is-eq tx-sender (get owner building)) ERR-NOT-AUTHORIZED)
    (asserts! (not (is-eq manager (get owner building))) ERR-INVALID-INPUT)

    (map-delete building-managers { building-id: building-id, manager: manager })
    (ok true)
  )
)

;; Update building status
(define-public (update-building-status (building-id uint) (new-status (string-ascii 20)))
  (let ((building (unwrap! (map-get? buildings { building-id: building-id }) ERR-BUILDING-NOT-FOUND)))
    (asserts! (or (is-eq tx-sender (get owner building)) (is-authorized-manager building-id tx-sender)) ERR-NOT-AUTHORIZED)

    (map-set buildings
      { building-id: building-id }
      (merge building { status: new-status })
    )
    (ok true)
  )
)

;; Read-only Functions

;; Get building details
(define-read-only (get-building (building-id uint))
  (map-get? buildings { building-id: building-id })
)

;; Check if user is authorized manager
(define-read-only (is-authorized-manager (building-id uint) (manager principal))
  (default-to false (get authorized (map-get? building-managers { building-id: building-id, manager: manager })))
)

;; Get buildings owned by a principal
(define-read-only (get-owner-buildings (owner principal))
  (map-get? owner-buildings { owner: owner })
)

;; Get next building ID
(define-read-only (get-next-building-id)
  (var-get next-building-id)
)

;; Check if building exists
(define-read-only (building-exists (building-id uint))
  (is-some (map-get? buildings { building-id: building-id }))
)

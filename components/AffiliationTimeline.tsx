"use client"

import { useState } from 'react'
import { AffiliationEntry } from '@/lib/types'

type AffiliationTimelineProps = {
  title: string
  items: AffiliationEntry[]
  minYear: number
  maxYear: number
  minYearOverride?: number
  compact?: boolean
}

type LaneAssignment = {
  entry: AffiliationEntry
  lane: number
}

type LabelPlacement = {
  x: number
  y: number
  width: number
  height: number
}

type ActiveTooltip = {
  entry: AffiliationEntry
  leftPercent: number
  topPercent: number
}

function assignLanes(entries: AffiliationEntry[], maxYear: number): LaneAssignment[] {
  const sorted = [...entries].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  )

  const lanes: { endTime: number; lane: number }[] = []
  const assignments: LaneAssignment[] = []

  const fallbackEndTime = new Date(`${maxYear}-12-31`).getTime()

  for (const entry of sorted) {
    const startTime = new Date(entry.startDate).getTime()
    const endTime = entry.endDate ? new Date(entry.endDate).getTime() : fallbackEndTime

    let laneIndex = 0
    for (; laneIndex < lanes.length; laneIndex++) {
      if (startTime >= lanes[laneIndex].endTime) {
        lanes[laneIndex].endTime = endTime
        break
      }
    }

    if (laneIndex === lanes.length) {
      lanes.push({ endTime, lane: laneIndex })
    }

    assignments.push({ entry, lane: laneIndex })
  }

  return assignments
}

function overlapsHorizontally(left: LabelPlacement, right: LabelPlacement, gap: number): boolean {
  return left.x < right.x + right.width + gap && left.x + left.width + gap > right.x
}

function overlapsVertically(top: LabelPlacement, bottom: LabelPlacement, gap: number): boolean {
  return top.y < bottom.y + bottom.height + gap && top.y + top.height + gap > bottom.y
}

function resolveLabelY(
  initialPlacement: LabelPlacement,
  placedLabels: LabelPlacement[],
  gap: number,
): number {
  let candidateY = initialPlacement.y

  for (let attempt = 0; attempt < placedLabels.length + 4; attempt++) {
    let nextY = candidateY

    for (const placed of placedLabels) {
      const candidatePlacement = { ...initialPlacement, y: candidateY }

      if (!overlapsHorizontally(candidatePlacement, placed, gap)) {
        continue
      }

      if (overlapsVertically(candidatePlacement, placed, gap)) {
        nextY = Math.min(nextY, placed.y - initialPlacement.height - gap)
      }
    }

    if (nextY === candidateY) {
      break
    }

    candidateY = nextY
  }

  return candidateY
}

export default function AffiliationTimeline({
  title,
  items,
  minYear,
  maxYear,
  minYearOverride,
  compact = false,
}: AffiliationTimelineProps) {
  const [activeTooltip, setActiveTooltip] = useState<ActiveTooltip | null>(null)

  if (items.length === 0) return null

  const assignments = assignLanes(items, maxYear)
  const laneCount = Math.max(1, ...assignments.map((a) => a.lane + 1))

  const paddingLeft = 56
  const paddingRight = 72
  const paddingY = compact ? 2 : 4
  const topSafePadding = compact ? 8 : paddingY
  const laneHeight = compact ? 54 : 64
  // Place the axis clearly below all lanes to avoid overlap with labels
  const baseY = paddingY + laneHeight * laneCount + (compact ? 8 : 10)

  const width = 800
  const labelCardHeight = compact ? 34 : 34
  const labelGap = compact ? 1 : 2
  const labelOffset = compact ? 4 : 6
  const labelWidth = 220

  const years: number[] = []
  const startYear =
    typeof minYearOverride === 'number'
      ? Math.max(minYear, minYearOverride)
      : minYear

  for (let y = startYear; y <= maxYear; y++) {
    years.push(y)
  }

  const minTime = new Date(`${startYear}-01-01`).getTime()
  const maxTime = new Date(`${maxYear}-12-31`).getTime()
  const timeSpan = Math.max(1, maxTime - minTime)

  const yForLane = (lane: number) => baseY - lane * laneHeight
  const xForTime = (time: number) =>
    paddingLeft + ((time - minTime) / timeSpan) * (width - paddingLeft - paddingRight)
  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max)

  const placedLabels: LabelPlacement[] = []
  const labelPlacements = assignments.map(({ entry, lane }) => {
    const startTime = new Date(entry.startDate).getTime()
    const x1 = xForTime(startTime)
    const y = yForLane(lane)

    const labelX = clamp(x1 - 8, paddingLeft, width - paddingRight - labelWidth)
    const initialPlacement: LabelPlacement = {
      x: labelX,
      y: y - labelCardHeight - labelOffset,
      width: labelWidth,
      height: labelCardHeight,
    }
    const labelY = resolveLabelY(initialPlacement, placedLabels, labelGap)
    const placement = { ...initialPlacement, y: labelY }

    placedLabels.push(placement)

    return {
      entry,
      lane,
      x1,
      y,
      placement,
    }
  })

  const minLabelY = labelPlacements.length > 0
    ? Math.min(...labelPlacements.map((item) => item.placement.y))
    : paddingY
  const chartShiftY = minLabelY < topSafePadding ? topSafePadding - minLabelY : 0
  // Keep only enough space for ticks/year labels under the axis.
  const height = baseY + chartShiftY + (compact ? 24 : 28)

  return (
    <div className="w-full overflow-visible">
      <div className="relative w-full overflow-visible">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`${title} affiliations timeline from ${minYear} to ${maxYear}`}
          className="w-full h-auto overflow-visible"
        >
          {/* Base line with arrow */}
          <line
            x1={paddingLeft}
            y1={baseY + chartShiftY}
            x2={width - paddingRight - 8}
            y2={baseY + chartShiftY}
            stroke="#4B5563"
            strokeWidth={2}
          />
          <polygon
            points={`${width - paddingRight - 8},${baseY + chartShiftY} ${width - paddingRight - 20},${
              baseY + chartShiftY - 6
            } ${width - paddingRight - 20},${baseY + chartShiftY + 6}`}
            fill="#4B5563"
          />

          {/* Year ticks and labels */}
          {years.map((year) => {
            const approxTime = new Date(`${year}-01-01`).getTime()
            const isFirstYear = year === startYear
            const isLastYear = year === maxYear
            const x = isFirstYear
              ? paddingLeft + 4
              : isLastYear
                ? width - paddingRight - 4
                : xForTime(approxTime)
            const textAnchor = isFirstYear
              ? 'start'
              : isLastYear
                ? 'end'
                : 'middle'
            return (
              <g key={year}>
                <line
                  x1={x}
                  y1={baseY + chartShiftY - 6}
                  x2={x}
                  y2={baseY + chartShiftY + 6}
                  stroke="#9CA3AF"
                  strokeWidth={1}
                />
                <text
                  x={x}
                  y={baseY + chartShiftY + 18}
                  textAnchor={textAnchor}
                  fill="#4B5563"
                  fontSize={10}
                >
                  {year}
                </text>
              </g>
            )
          })}

          {/* Affiliation segments */}
          {labelPlacements.map(({ entry, lane, x1, y, placement }) => {
            const endTime = entry.endDate
              ? new Date(entry.endDate).getTime()
              : new Date(`${maxYear}-12-31`).getTime()
            const x2 = xForTime(endTime)
            const lineY = y + chartShiftY

            const label = entry.institution
            const subtitle = entry.role ?? entry.degree ?? entry.field

            const hasLogo = Boolean(entry.logo)
            const hasDetails = Boolean(entry.details || entry.detailsPoints?.length)
            const isActive = activeTooltip?.entry === entry
            const leftPercent = (placement.x / width) * 100
            const topPercent = ((placement.y + chartShiftY) / height) * 100

            return (
              <g
                key={`${entry.institution}-${entry.startDate}-${lane}`}
                tabIndex={hasDetails ? 0 : -1}
                role={hasDetails ? 'button' : undefined}
                aria-label={
                  hasDetails
                    ? `${label} ${subtitle ? `– ${subtitle}` : ''} details`
                    : undefined
                }
                onMouseEnter={() => {
                  if (!hasDetails) return
                  setActiveTooltip({ entry, leftPercent, topPercent })
                }}
                onMouseLeave={() => {
                  if (!hasDetails) return
                  setActiveTooltip((current) =>
                    current && current.entry === entry ? null : current
                  )
                }}
                onFocus={() => {
                  if (!hasDetails) return
                  setActiveTooltip({ entry, leftPercent, topPercent })
                }}
                onBlur={() => {
                  if (!hasDetails) return
                  setActiveTooltip((current) =>
                    current && current.entry === entry ? null : current
                  )
                }}
                onClick={() => {
                  if (!hasDetails) return
                  setActiveTooltip((current) =>
                    current && current.entry === entry ? null : { entry, leftPercent, topPercent }
                  )
                }}
              >
                <rect
                  x={x1}
                  y={lineY - 10}
                  width={Math.max(12, x2 - x1)}
                  height={20}
                  rx={6}
                  fill={isActive ? '#DC2626' : '#111827'}
                  opacity={isActive ? 0.18 : 0.08}
                />
                <line
                  x1={x1}
                  y1={lineY}
                  x2={x2}
                  y2={lineY}
                  stroke={isActive ? '#DC2626' : '#111827'}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
                <circle cx={x1} cy={lineY} r={4} fill={isActive ? '#DC2626' : '#111827'} />
                <circle cx={x2} cy={lineY} r={4} fill={isActive ? '#DC2626' : '#111827'} />

                <foreignObject
                  x={placement.x}
                  y={placement.y + chartShiftY}
                  width={placement.width}
                  height={placement.height}
                >
                  <div
                    className="flex h-full w-full items-center rounded-md bg-transparent px-2 py-1"
                  >
                    {hasLogo && (
                      <img
                        src={entry.logo as string}
                        alt={`${entry.institution} logo`}
                        className="mr-2 h-5 w-10 flex-none object-contain"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold leading-tight text-gray-900 [overflow-wrap:anywhere]">
                        {label}
                      </div>
                      {subtitle && (
                        <div className="text-[10px] leading-tight text-gray-600 [overflow-wrap:anywhere]">
                          {subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                </foreignObject>
              </g>
            )
          })}
        </svg>

        {activeTooltip && (
          <div
            className="pointer-events-none absolute z-50 max-w-xs rounded-md bg-white/95 p-3 text-xs shadow-lg ring-1 ring-gray-200 backdrop-blur"
            style={{
              left: `${activeTooltip.leftPercent}%`,
              top: `${activeTooltip.topPercent}%`,
              transform: 'translateY(-100%)',
            }}
            role="tooltip"
          >
            <div className="mb-1 text-xs font-semibold text-gray-900">
              {activeTooltip.entry.institution}
            </div>
            {activeTooltip.entry.role || activeTooltip.entry.degree || activeTooltip.entry.field ? (
              <div className="mb-1 text-[11px] text-gray-700">
                {activeTooltip.entry.role ??
                  activeTooltip.entry.degree ??
                  activeTooltip.entry.field}
              </div>
            ) : null}
            {activeTooltip.entry.startDate && (
              <div className="mb-2 text-[11px] text-gray-500">
                {formatDateRange(activeTooltip.entry.startDate, activeTooltip.entry.endDate)}
              </div>
            )}
            {activeTooltip.entry.details && (
              <p className="mb-1 text-[11px] text-gray-700">
                {activeTooltip.entry.details}
              </p>
            )}
            {activeTooltip.entry.detailsPoints && activeTooltip.entry.detailsPoints.length > 0 && (
              <ul className="mt-1 list-disc pl-4 text-[11px] text-gray-700">
                {activeTooltip.entry.detailsPoints.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function formatDateRange(startDate: string, endDate?: string | null): string {
  const formatter = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
  })

  const start = new Date(startDate)
  const startLabel = formatter.format(start)

  if (!endDate) {
    return `${startLabel} – present`
  }

  const end = new Date(endDate)
  const endLabel = formatter.format(end)

  if (startLabel === endLabel) {
    return startLabel
  }

  return `${startLabel} – ${endLabel}`
}


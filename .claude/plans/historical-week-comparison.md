# Historical Week Comparison - Implementation Plan

## Overview
Add week-over-week comparison functionality to show historical trends for reactive/planned percentages, with a comparison indicator on the Reactive Load card.

## Current State Analysis

### Existing Infrastructure ✅
1. **Data Structure** - Already have `weeklyHistory` in `weeklySchedule.js`
   - Format: `{ "2024-11-26": { weekStart: "2024-11-26", schedule: [...] } }`
   - Already has one historical week (Nov 26)
   
2. **Helper Functions** - Already exist:
   - `getWeekSchedule(weekKey)` - Get schedule for any week
   - `getAvailableWeeks()` - Get sorted list of all weeks
   - `calculateMetrics(schedule)` - Calculate planned/reactive percentages
   
3. **Components**
   - `WeekHistory.jsx` - Exists but uses localStorage (different pattern)
   - `WorkloadTracker.jsx` - Has weekly workload visualization
   - Weekly navigation already implemented in WeeklyAgenda

### Current Metrics Calculation
```javascript
calculateMetrics(schedule) returns:
- plannedPercent: number
- reactivePercent: number  
- rndPercent: number
```

## Implementation Plan

### Phase 1: Add Week Comparison Utility Functions
**File:** `src/data/weeklySchedule.js`

Add new functions:
```javascript
/**
 * Get previous week's key
 * @param {string} currentWeekKey - Current week (YYYY-MM-DD)
 * @returns {string|null} - Previous week key or null
 */
export function getPreviousWeekKey(currentWeekKey)

/**
 * Calculate week-over-week change
 * @param {Object} currentMetrics - Current week metrics
 * @param {Object} previousMetrics - Previous week metrics
 * @returns {Object} - { reactiveChange, plannedChange, direction }
 */
export function calculateWeekOverWeekChange(currentMetrics, previousMetrics)
```

### Phase 2: Enhance Reactive Load Card
**File:** `src/MerrickMonitor.jsx`

**Location:** Line ~1268 (Reactive Load card in Top Stats Row)

**Changes:**
1. Calculate previous week's metrics
2. Add comparison indicator below the main percentage
3. Show trend arrow (↑/↓) and percentage change

**Visual Design:**
```
┌─────────────────────────┐
│ REACTIVE LOAD           │
│ 30%                     │
│ ↑ 10% vs last week     │  ← NEW
└─────────────────────────┘
```

**Color coding:**
- Green/down arrow: Reactive load decreased (good)
- Red/up arrow: Reactive load increased (needs attention)
- Gray/dash: No change or no previous week data

### Phase 3: Add Historical Trend Chart Component
**New File:** `src/components/HistoricalTrends.jsx`

**Features:**
- Mini chart showing last 4-8 weeks
- Planned vs Reactive trend lines
- Optional: Click to expand for detailed view

**Integration Points:**
- Add as new tab in main navigation (OVERVIEW, ADOPTION, AGENDA, **TRENDS**)
- OR add to OVERVIEW page in right column

### Phase 4: Week-over-Week Comparison View
**Enhancement to:** `src/components/WeeklyAgenda.jsx` or new component

**Features:**
- Side-by-side comparison: This Week vs Last Week
- Highlight differences in work distribution
- Show what changed (new reactive work added, etc.)

## Data Flow

```
1. User loads dashboard
   ↓
2. Get current week schedule → calculate metrics
   ↓
3. Get previous week from weeklyHistory → calculate metrics
   ↓
4. Calculate change (current - previous)
   ↓
5. Display in Reactive Load card with trend indicator
   ↓
6. Store aggregated metrics for trend chart
```

## Implementation Steps

### Step 1: Add Comparison Utilities
- [ ] Add `getPreviousWeekKey()` function
- [ ] Add `calculateWeekOverWeekChange()` function
- [ ] Test with existing historical data (Nov 26 week)

### Step 2: Update Reactive Load Card
- [ ] Calculate previous week metrics in MerrickMonitor.jsx
- [ ] Add comparison indicator UI
- [ ] Style trend arrow and percentage
- [ ] Handle edge cases (no previous week, first week)

### Step 3: Test with Real Data
- [ ] Verify Nov 26 week (40% reactive) vs Dec 1 week (30% reactive)
- [ ] Should show "↓ 10% vs last week" in green
- [ ] Ensure works with missing historical data

### Step 4: Create Trends Chart (Optional Future)
- [ ] Create HistoricalTrends.jsx component
- [ ] Add simple line chart visualization
- [ ] Integrate into dashboard

## Questions for User

1. **Trend Chart Priority**: Do you want the full historical trend chart now, or focus on the week-over-week comparison on the Reactive Load card first?

2. **Comparison Display**: Should the comparison show:
   - Absolute change: "↑ 10%" 
   - Relative change: "↑ 33% increase"
   - Both: "↑ 10pts (+33%)"

3. **Historical Data Storage**: Currently using `weeklyHistory` in code. Should we:
   - Keep manual updates to weeklySchedule.js
   - Auto-archive to localStorage/JSON file
   - Add a "Archive This Week" button

4. **Metrics to Track**: Besides reactive load, should we also show week-over-week for:
   - Planned work percentage
   - Dev days (commit activity)
   - Active tools count

## Recommended Approach

**Start Small:**
1. Add comparison utilities (Step 1)
2. Enhance Reactive Load card with "vs last week" indicator (Step 2)
3. Test and validate
4. Then add full trend chart if needed

**Timeline:**
- Steps 1-2: ~30 minutes
- Testing: ~10 minutes
- Step 4 (trend chart): ~1-2 hours if desired

## Files to Modify

1. `src/data/weeklySchedule.js` - Add utility functions
2. `src/MerrickMonitor.jsx` - Update Reactive Load card (lines ~1268-1281)

## Files to Create (Optional)

1. `src/components/HistoricalTrends.jsx` - Trend chart component

## Edge Cases to Handle

1. **No previous week**: Show "First week" or hide comparison
2. **Missing data**: Handle null/undefined gracefully
3. **Same percentages**: Show "No change" or "−" symbol
4. **Multiple weeks old**: Currently only comparing to previous week, not showing longer trends yet

## Success Criteria

✅ Reactive Load card shows week-over-week comparison
✅ Trend indicator (↑/↓) is color-coded appropriately
✅ Works with existing historical data (Nov 26)
✅ Handles missing data gracefully
✅ Visual design matches retro terminal theme

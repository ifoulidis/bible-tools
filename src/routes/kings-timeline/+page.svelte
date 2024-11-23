<script lang="ts">
  import tippy from 'tippy.js'

  let kings = [
    {
      id: 35,
      name: 'Saul',
      startDate: 1050,
      endDate: 1010,
      IsraelJudah: 'Both',
    },
    {
      id: 50,
      name: 'David',
      startDate: 1010,
      endDate: 970,
      IsraelJudah: 'Both',
    },
    {
      id: 36,
      name: 'Solomon',
      startDate: 970,
      endDate: 930,
      IsraelJudah: 'Both',
    },
    {
      id: 1,
      name: 'Jeroboam I',
      startDate: 931,
      endDate: 910,
      IsraelJudah: 'Israel',
    },
    {
      id: 2,
      name: 'Rehoboam',
      startDate: 931,
      endDate: 913,
      IsraelJudah: 'Judah',
    },
    {
      id: 3,
      name: 'Abijam',
      startDate: 913,
      endDate: 911,
      IsraelJudah: 'Judah',
    },
    {
      id: 4,
      name: 'Nadab',
      startDate: 910,
      endDate: 909,
      IsraelJudah: 'Israel',
    },
    {
      id: 5,
      name: 'Asa',
      startDate: 911,
      endDate: 870,
      IsraelJudah: 'Judah',
    },
    {
      id: 6,
      name: 'Baasha',
      startDate: 909,
      endDate: 886,
      IsraelJudah: 'Israel',
    },
    {
      id: 7,
      name: 'Elah',
      startDate: 886,
      endDate: 885,
      IsraelJudah: 'Israel',
    },
    {
      id: 8,
      name: 'Zimri',
      startDate: 885,
      endDate: 884,
      IsraelJudah: 'Israel',
    },
    {
      id: 9,
      name: 'Omri',
      startDate: 885,
      endDate: 874,
      IsraelJudah: 'Israel',
    },
    {
      id: 10,
      name: 'Ahab',
      startDate: 874,
      endDate: 853,
      IsraelJudah: 'Israel',
    },
    {
      id: 11,
      name: 'Jehoshaphat',
      startDate: 873,
      endDate: 870,
      IsraelJudah: 'Judah',
    },
    {
      id: 12,
      name: 'Ahaziah',
      startDate: 853,
      endDate: 852,
      IsraelJudah: 'Israel',
    },
    {
      id: 13,
      name: 'Jehoram',
      startDate: 853,
      endDate: 848,
      IsraelJudah: 'Israel',
    },
    {
      id: 14,
      name: 'Joram',
      startDate: 852,
      endDate: 841,
      IsraelJudah: 'Israel',
    },
    {
      id: 15,
      name: 'Jehu',
      startDate: 841,
      endDate: 814,
      IsraelJudah: 'Israel',
    },
    {
      id: 16,
      name: 'Athaliah',
      startDate: 841,
      endDate: 835,
      IsraelJudah: 'Judah',
    },
    {
      id: 17,
      name: 'Joash',
      startDate: 835,
      endDate: 796,
      IsraelJudah: 'Judah',
    },
    {
      id: 18,
      name: 'Jeroboam II',
      startDate: 793,
      endDate: 782,
      IsraelJudah: 'Israel',
    },
    {
      id: 19,
      name: 'Amaziah',
      startDate: 796,
      endDate: 767,
      IsraelJudah: 'Judah',
    },
    {
      id: 20,
      name: 'Azariah',
      startDate: 791,
      endDate: 767,
      IsraelJudah: 'Judah',
    },
    {
      id: 21,
      name: 'Zechariah',
      startDate: 753,
      endDate: 752,
      IsraelJudah: 'Israel',
    },
    {
      id: 22,
      name: 'Menahem',
      startDate: 752,
      endDate: 742,
      IsraelJudah: 'Israel',
    },
    {
      id: 23,
      name: 'Jotham',
      startDate: 751,
      endDate: 740,
      IsraelJudah: 'Judah',
    },
    {
      id: 24,
      name: 'Ahaz',
      startDate: 742,
      endDate: 736,
      IsraelJudah: 'Judah',
    },
    {
      id: 25,
      name: 'Hezekiah',
      startDate: 728,
      endDate: 715,
      IsraelJudah: 'Judah',
    },
    {
      id: 26,
      name: 'Manasseh',
      startDate: 697,
      endDate: 642,
      IsraelJudah: 'Judah',
    },
    {
      id: 27,
      name: 'Josiah',
      startDate: 640,
      endDate: 608,
      IsraelJudah: 'Judah',
    },
    {
      id: 28,
      name: 'Jehoahaz',
      startDate: 608,
      endDate: 608,
      IsraelJudah: 'Judah',
    },
    {
      id: 29,
      name: 'Jehoiakim',
      startDate: 608,
      endDate: 597,
      IsraelJudah: 'Judah',
    },
    {
      id: 30,
      name: 'Zedekiah',
      startDate: 597,
      endDate: 586,
      IsraelJudah: 'Judah',
    },
  ]
  let selected = $state(2)
  let url = $derived('#king-' + selected.toString())
  function scroll(id: number) {
    selected = id
    const el = document.querySelector(url)
    if (!el) return
    el.scrollIntoView({
      behavior: 'smooth',
      inline: 'end',
    })
  }

  function getWidth(startDate: number, endDate: number) {
    if (startDate - endDate !== 0) {
      return (startDate - endDate) * 4
    } else return 1
  }

  function getMarkerColor(areaRuled: string) {
    if (areaRuled === 'Both') return 'purple'
    return areaRuled === 'Judah' ? 'red' : 'blue'
  }

  kings.sort((a, b) => b.startDate - a.startDate)

  function tooltip(node, fn) {
    $effect(() => {
      const tooltip = tippy(node, { content: fn })

      return tooltip.destroy
    })
  }
</script>

<div class="cont">
  <h1>Biblical Kings Timeline</h1>

  <div class="chart">
    {#each kings as king}
      <div class="row">
        <button onclick={() => scroll(king.id)} class="button">
          {king.name}
        </button>
        <div
          use:tooltip={() => king.startDate.toString() + '–' + king.endDate.toString() + ' B.C.'}
          id="king-{king.id.toString()}"
          class="marker"
          style:background-color={getMarkerColor(king.IsraelJudah)}
          style:border={selected === king.id ? '2px solid black' : 'none'}
          style:width="{getWidth(king.startDate, king.endDate)}px"
          style:margin-left="{(1050 - king.startDate) * 4}px"
        ></div>
      </div>
    {/each}
  </div>
  <div class="timeline">
    <p>1050 B.C.</p>
    <p>934 B.C.</p>
    <p>818 B.C.</p>
    <p>702 B.C.</p>
    <p>586 B.C.</p>
  </div>
</div>

<style>
  h1 {
    font-size: 2rem;
    color: #000;
    margin-bottom: 2rem;
  }
  .cont {
    --dark: rgb(49, 49, 49);
    max-width: 900px;
    width: max-content;
    margin: 2rem auto;
  }

  .chart {
    display: grid;
    grid-template-rows: auto;
    max-height: 80vh;
    overflow: auto;
    scrollbar-color: white var(--dark);
    scrollbar-width: thin;
  }
  .timeline {
    display: flex;
    justify-content: space-between;
    padding-left: 13rem;
    border-top: 2px solid var(--dark);
  }
  .row {
    display: flex;
    margin: 0.2rem 0.3rem;
    height: 2rem;
    width: 100%;
  }
  .button {
    position: sticky;
    left: 0;
    font-size: 1.2rem;
    height: 2rem;
    text-align: left;
    width: 13rem;
  }
  .marker {
    height: 50%;
    margin-top: auto;
    margin-bottom: auto;
    border-radius: 0.3rem;
  }
  :global {
    [data-tippy-root] {
      --bg: #666;
      background-color: var(--bg);
      color: white;
      border-radius: 0.2rem;
      padding: 0.2rem 0.6rem;
      filter: drop-shadow(1px 1px 3px rgb(0 0 0 / 0.1));

      * {
        transition: none;
      }
    }
  }
</style>

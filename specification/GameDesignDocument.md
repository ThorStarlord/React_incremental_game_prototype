# Game Design Document
## React Incremental RPG Prototype

**Version:** 1.0  
**Date:** Current  
**Status:** Living Document  

---

## 🎯 Executive Summary

The React Incremental RPG Prototype is an experimental incremental game that explores emotional connection mechanics as the core progression driver. Unlike traditional incremental games focused on numerical growth, this prototype emphasizes building meaningful relationships with NPCs to unlock character abilities and create allied entities.

### Core Innovation
The game replaces traditional "clicking for numbers" with "connecting for growth," where players invest time and emotional intelligence to build relationships that yield both mechanical benefits and narrative depth.

## 🌟 Game Concept

### Vision Statement
Create an incremental RPG where emotional intelligence and relationship building drive progression, allowing players to acquire abilities through understanding and connecting with diverse characters rather than grinding resources.

### Target Experience
Players should feel like they're building a network of meaningful relationships while gradually becoming more capable through the wisdom and abilities gained from these connections.

### Unique Selling Points
1. **Emotional Connection Mechanics** - Relationships as primary progression currency
2. **Trait Acquisition System** - Learn abilities from NPCs through understanding
3. **Copy Creation** - Transform deep connections into allied entities
4. **Essence Economy** - Metaphysical resource generated from emotional bonds
5. **Character Customization** - Build unique character combinations through relationship choices

## 🎮 Core Gameplay Loop

### Primary Loop (5-10 minutes)
1. **Discover NPCs** - Encounter new characters with unique traits and personalities
2. **Build Relationships** - Engage in dialogue and activities to deepen connections
3. **Generate Essence** - Passive resource generation from active emotional connections
4. **Acquire Traits** - Spend Essence to learn abilities from connected NPCs
5. **Customize Character** - Equip and manage acquired traits for desired build

### Secondary Loop (30-60 minutes)
1. **Deepen Existing Connections** - Strengthen relationships for better Essence generation
2. **Make Traits Permanent** - Invest significant Essence to free up trait slots
3. **Create Copies** - Transform deepest connections into allied entities
4. **Manage Copy Network** - Direct and develop allied entities for various tasks
5. **Explore New Areas** - Unlock regions with unique NPCs and opportunities

### Meta Loop (Multiple Sessions)
1. **Character Mastery** - Develop specialized character builds through trait combinations
2. **Relationship Portfolio** - Build diverse network of connections for varied benefits
3. **Copy Empire** - Manage multiple allied entities with specialized roles
4. **Narrative Discovery** - Uncover deeper stories through long-term NPC relationships
5. **System Mastery** - Optimize Essence generation and trait acquisition strategies

## 🧠 Core Mechanics

### Emotional Connection System
**Concept**: The foundation of all progression, representing the depth of understanding and bond between player and NPCs. This connection is crucial for unlocking interactions and generating Essence.

**Implementation**:
- **Connection Depth** - Numerical representation of relationship strength (0-100). This is the primary stat for tracking Emotional Connection.
- **Connection Quality** - Categorical assessment of relationship type (friendship, mentorship, rivalry) - *Planned for future implementation.*
- **Essence Generation** - Passive resource production directly linked to the `connectionDepth` of active emotional connections.
- **Unlock Gates** - Deeper connections unlock new interaction options and content (e.g., tabs in the NPC panel).

**Player Actions**:
- Engage in meaningful dialogue choices that resonate with NPC personalities
- Complete personal quests or favors that matter to the NPC
- Share beneficial traits to demonstrate care and investment
- Spend time in activities the NPC enjoys or values

**Player Actions**:
- Engage in meaningful dialogue choices that resonate with NPC personalities
- Complete personal quests or favors that matter to the NPC
- Share beneficial traits to demonstrate care and investment
- Spend time in activities the NPC enjoys or values

### Essence System
**Concept**: Metaphysical currency representing emotional energy and potential for growth. Essence is the primary resource for advanced actions and progression.

**Generation**:
- **Passive Income** - Continuous generation directly from the `connectionDepth` of all active emotional connections.
- **Connection Depth Influence** - Higher `connectionDepth` with NPCs leads to increased passive Essence generation.
- **NPC Uniqueness** - More complex or powerful NPCs provide higher base generation rates for their connections.
- **Manual Actions** - Limited direct generation through focused actions (e.g., clicking a button).
- **Trait Multipliers** - Certain player traits can increase the overall Essence generation rate.

**Consumption**:
- **Trait Acquisition (Resonance)** - Primary Essence sink for learning new abilities from NPCs. This is the "Resonance" action.
- **Trait Permanence** - Major investment to make traits always active without slot usage.
- **Copy Acceleration** - Speed up entity creation and development.
- **Emotional Influence** - Direct manipulation of NPC emotional states - *Planned for future implementation.*

**Consumption**:
- **Trait Acquisition** - Primary Essence sink for learning new abilities
- **Trait Permanence** - Major investment to make traits always active
- **Copy Acceleration** - Speed up entity creation and development
- **Emotional Influence** - Direct manipulation of NPC emotional states

### Trait System
**Concept**: Abilities, characteristics, and passive bonuses that define character capabilities. Traits are acquired from NPCs and equipped to enhance the player.

**Acquisition Methods**:
- **Resonance** - The primary method for acquiring traits. This is an **action** where the player spends **Essence** to copy an observed trait from an NPC. This action requires a sufficient level of **Emotional Connection** (`connectionDepth`) with the NPC.
- **Quest Rewards** - Direct grants from significant achievements.
- **Research** - Future system for discovering abstract or unique traits.
- **Copy Inheritance** - Traits passed to created entities.

**Management**:
- **Limited Slots** - Players start with few trait slots, unlock more through progression
- **Permanent Traits** - Expensive option to make traits always active without slot usage
- **Trait Categories** - Combat, Social, Physical, Mental traits with different applications
- **Synergy Systems** - Future combinations and interactions between traits

### NPC Interaction System
**Concept**: Rich interaction framework supporting diverse relationship types and progression paths.

**Relationship Progression**:
- **Discovery Phase** - Initial NPC encounter and basic information gathering
- **Acquaintance Level** - Basic dialogue and simple trait observation
- **Friend Level** - Deeper conversations, quest access, trait acquisition options
- **Close Bond** - Advanced interactions, trait sharing, emotional influence
- **Deep Connection** - Copy creation potential, permanent trait options, unique content

**Interaction Types**:
- **Dialogue Systems** - Branching conversations with personality-aware responses
- **Activity Participation** - Join NPCs in activities they enjoy or need help with
- **Gift Systems** - Share resources, traits, or assistance meaningful to the NPC
- **Conflict Resolution** - Help NPCs overcome personal challenges or problems

### Copy Creation System
**Concept**: Transform deep emotional connections into allied entities that assist the player. Copies inherit aspects of the player and their "parent" NPC.

**Creation Process**:
- **Seduction Outcome** - A successful outcome of a specific deep relationship interaction with an NPC creates the opportunity to create a Copy.
- **Growth Options** - Choose between time-intensive natural growth or Essence-accelerated development.
- **Trait Inheritance** - A new Copy inherits a snapshot of traits the player had actively shared with the parent NPC at the moment of creation.
- **Loyalty System** - Ongoing relationship maintenance is required for reliable Copy behavior.

**Inheritance**:
- **Emotional Resonance (Player Ability):** Copies inherit the player's core "Emotional Resonance" ability. This is a planned player characteristic that allows Copies to potentially form connections and interact with the Trait system (perhaps in a limited way initially). Its specific mechanics are currently undefined and planned for future implementation with the Copy system. **Note: This is distinct from the sidelined "Soul Resonance" concept found in `soulResonanceUtils.ts`.**
- **Shared Traits:** Copies inherit *snapshots* of any traits the player had actively shared with the *target parent* via Trait Slots *at the moment of creation*. These become the Copy's initial base traits. They do *not* automatically update if the player later changes the traits shared with the parent.
- **Player Traits:** Copies do not inherit traits the player has permanently active or equipped for themselves by default, to differentiate them from the player.

**Copy Management**:
- **Task Assignment** - Direct Copies to perform specific activities or goals.
- **Trait Sharing** - Grant additional abilities to Copies for specialized roles via dedicated Copy Trait Slots.
- **Loyalty Maintenance** - Ongoing investment required to prevent Copy independence or rebellion.
- **Capability Limits** - Maximum number of active Copies based on player progression.

## 🎨 Aesthetic & Narrative Direction

### Visual Style
- **Clean Interface Design** - Material-UI components with consistent theming
- **Relationship Visualization** - Clear progress indicators and connection strength displays
- **Character Representation** - Avatar systems with personality expression
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile devices

### Narrative Themes
- **Emotional Intelligence** - Understanding others as a form of power and growth
- **Connection vs. Isolation** - Benefits of building relationships vs. self-reliance
- **Personal Growth** - Learning from others while maintaining individual identity
- **Responsibility** - Managing relationships and created entities with care
- **Diversity of Perspective** - Value in connecting with different types of people

### Tone
- **Optimistic** - Focus on positive relationship building and mutual benefit
- **Thoughtful** - Encourage reflection on relationship dynamics and emotional intelligence
- **Empowering** - Players feel capable of growth through understanding others
- **Inclusive** - NPCs represent diverse backgrounds, personalities, and perspectives

## 🚀 Progression Systems

### Character Development
- **Attribute Growth** - Strength, Charisma, Intelligence affect various game systems
- **Skill Advancement** - Specialized abilities improve through use and training
- **Trait Mastery** - Growing expertise with equipped traits through consistent use
- **Equipment Progression** - Items that enhance character capabilities and appearance

### Relationship Portfolio
- **Connection Diversity** - Benefits from building relationships with different NPC types
- **Depth vs. Breadth** - Balance between many shallow connections vs. few deep bonds
- **Network Effects** - NPCs who know each other provide synergistic benefits
- **Relationship Maintenance** - Ongoing attention required to maintain connection strength

### Copy Network Development
- **Specialization** - Develop Copies for specific roles (combat, social, resource gathering)
- **Coordination** - Manage multiple Copies working together on complex tasks
- **Evolution** - Copies grow and change based on their experiences and assignments
- **Independence** - Advanced Copies develop their own goals and relationships

### Essence Economy Mastery
- **Generation Optimization** - Maximize Essence income through strategic relationship building
- **Efficient Spending** - Learn optimal investment patterns for trait acquisition and permanence
- **Market Dynamics** - Understand relative value of different traits and abilities
- **Resource Planning** - Long-term strategy for major Essence investments

## 🎯 Success Metrics

### Player Engagement
- **Session Length** - Average time spent per play session
- **Return Rate** - Percentage of players returning after first session
- **Progression Satisfaction** - Player feedback on growth feeling meaningful
- **Relationship Investment** - Time and effort players spend on individual NPCs

### Mechanical Balance
- **Essence Generation Rates** - Ensure progression feels rewarding but not trivial
- **Trait Acquisition Costs** - Balance between accessibility and meaningful investment
- **Copy Creation Frequency** - Rate that feels special but achievable
- **Relationship Progression Speed** - Pacing that maintains engagement without frustration

### Technical Performance
- **Load Times** - Responsive application startup and navigation
- **State Management** - Clean Redux patterns with efficient updates
- **Cross-Platform Compatibility** - Consistent experience across devices
- **Accessibility Compliance** - WCAG 2.1 AA standards throughout application

## 🔮 Future Vision

### Planned Expansions
- **Quest System** - Narrative-driven objectives that deepen NPC relationships
- **World Exploration** - Multiple locations with unique NPCs and opportunities
- **Advanced Copy Mechanics** - Complex task systems and Copy-to-Copy relationships
- **Trait Combinations** - Synergy systems for combining compatible traits
- **Multiplayer Elements** - Shared world where players can interact and compare progress

### Long-term Goals
- **Educational Value** - Teach emotional intelligence and relationship skills
- **Therapeutic Applications** - Explore game's potential for social skill development
- **Community Building** - Foster player community around relationship-building themes
- **Research Platform** - Gather insights about human relationship preferences and patterns
- **Commercial Viability** - Develop sustainable monetization that aligns with game values

## 📋 Implementation Roadmap

### Phase 1: Core Foundation ✅ **COMPLETE**
- ✅ Redux Toolkit state management architecture
- ✅ Feature-Sliced Design organization
- ✅ Basic Player, Trait, Essence, and NPC systems
- ✅ Responsive navigation and layout system
- ✅ Save/load functionality with import/export

### Phase 2: Enhanced Interactions ✅ **COMPLETE**
- ✅ Advanced NPC dialogue systems (Basic implementation complete)
- ✅ Trait acquisition and permanence mechanics (Essence cost for acquisition and permanence implemented)
- ✅ Enhanced Essence generation from relationships (Passive generation now based on NPC connection depth)
- 📋 Copy creation system implementation (Planned)
- 📋 Quest system foundation (Planned)

### Phase 3: Polish & Expansion 📋 **PLANNED**
- 📋 Advanced Copy management and task systems
- 📋 Multiple locations and world exploration
- 📋 Trait combination and synergy systems
- 📋 Enhanced narrative content and character development
- 📋 Performance optimization and mobile experience refinement

---

This Game Design Document serves as the guiding vision for the React Incremental RPG Prototype, establishing the core concept while remaining flexible enough to evolve based on implementation discoveries and player feedback.

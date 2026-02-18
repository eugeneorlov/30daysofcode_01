"""Seed the database with 20 BJJ techniques and their relationships."""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from sqlmodel import Session, select

from src.database import create_db_and_tables, engine
from src.models.technique import Technique, TechniqueRelationship

TECHNIQUES = [
    {
        "name": "Armbar from Guard",
        "position": "Guard",
        "type": "Submission",
        "difficulty": "Beginner",
        "description": (
            "The armbar from guard is one of the most fundamental submissions in BJJ. "
            "You control your opponent's arm while on your back and use your hips to hyperextend their elbow. "
            "It requires good hip mobility and timing to execute cleanly. "
            "This technique is often the first submission taught to beginners."
        ),
        "steps": [
            "From closed guard, grip opponent's same-side sleeve and collar.",
            "Break their posture down and angle your body to one side.",
            "Place your foot on their hip on the same side as the target arm.",
            "Swing the opposite leg over their head and across their neck.",
            "Squeeze your knees together and raise your hips to apply pressure.",
            "Control their thumb pointing upward and extend hips for the finish.",
        ],
        "common_mistakes": [
            "Not breaking posture before attempting the armbar.",
            "Leaving space between your knees, allowing escape.",
            "Rotating the wrong direction, losing control of the arm.",
            "Extending too quickly before securing the arm properly.",
        ],
        "counters": [
            "Stack and pass to avoid hip extension.",
            "Grab own belt or gi to prevent arm extension.",
            "Roll toward the thumb to relieve pressure.",
        ],
    },
    {
        "name": "Triangle Choke",
        "position": "Guard",
        "type": "Submission",
        "difficulty": "Intermediate",
        "description": (
            "The triangle choke is a blood choke applied using your legs to form a triangle around your opponent's neck and arm. "
            "It restricts blood flow to the brain by compressing the carotid arteries. "
            "It requires good hip flexibility and precise positioning to finish. "
            "The triangle is a versatile attack that can be entered from many positions."
        ),
        "steps": [
            "From closed guard, break opponent's posture and isolate one arm.",
            "Shoot your hips up and place your leg over their shoulder on the trapped arm side.",
            "Hook your leg behind their head using the back of your knee.",
            "Cross your ankle over your opposite leg's calf to lock the triangle.",
            "Angle your body 45 degrees to the trapped arm side.",
            "Squeeze your knees together and pull their head down to finish.",
        ],
        "common_mistakes": [
            "Not angling hips enough, reducing choke tightness.",
            "Failing to control the non-trapped arm, allowing posture recovery.",
            "Locking the triangle on the wrong side (neck rather than neck/shoulder junction).",
            "Allowing opponent to stack before triangle is locked.",
        ],
        "counters": [
            "Stack opponent to flatten hips and relieve pressure.",
            "Posture up before triangle is locked.",
            "Pass the arm through to relieve the choke.",
        ],
    },
    {
        "name": "Omoplata",
        "position": "Guard",
        "type": "Submission",
        "difficulty": "Intermediate",
        "description": (
            "The omoplata is a shoulder lock that targets the rotator cuff using your legs. "
            "You wrap one leg around your opponent's arm and use body rotation to apply shoulder pressure. "
            "It can also be used as a sweep when the submission is defended. "
            "Mastering the omoplata opens up a chain of attacks from the guard."
        ),
        "steps": [
            "From guard, create an angle similar to a triangle attempt.",
            "Instead of bringing the leg over the neck, swing it over their arm.",
            "Rotate your body away from the trapped arm to face the same direction.",
            "Secure their arm by sitting up and grabbing their belt or hip.",
            "Walk your body perpendicular to theirs, maintaining leg pressure.",
            "Apply downward pressure on their shoulder blade to finish.",
        ],
        "common_mistakes": [
            "Not rotating your body enough after swinging the leg over.",
            "Allowing opponent to roll out by not controlling their hip.",
            "Losing the arm when sitting up.",
            "Being stacked before completing the rotation.",
        ],
        "counters": [
            "Roll forward to relieve shoulder pressure.",
            "Posture up before the leg clears the arm.",
            "Grab own belt to prevent shoulder lock.",
        ],
    },
    {
        "name": "Hip Bump Sweep",
        "position": "Guard",
        "type": "Sweep",
        "difficulty": "Beginner",
        "description": (
            "The hip bump sweep is a fundamental sweep from closed guard that uses explosive hip rotation. "
            "You sit up while driving your hips into your opponent to knock them to the side. "
            "It pairs perfectly with the kimura as a combination attack. "
            "This sweep teaches essential guard offense principles of breaking posture and creating angles."
        ),
        "steps": [
            "From closed guard, open your guard and place one foot on the mat.",
            "Break opponent's posture by pulling their collar.",
            "Post your free hand on the mat behind you.",
            "Explosively sit up while driving your hips into their torso.",
            "Wrap your arm around their shoulder as you rotate.",
            "Continue rotating to end up in mount.",
        ],
        "common_mistakes": [
            "Not sitting up high enough before driving hips.",
            "Failing to control the far arm, allowing opponent to post.",
            "Moving too slowly, giving opponent time to react.",
            "Not completing the rotation to mount.",
        ],
        "counters": [
            "Post the free hand to base out.",
            "Drop weight to resist the hip drive.",
            "Step over the sweeping leg.",
        ],
    },
    {
        "name": "Scissor Sweep",
        "position": "Guard",
        "type": "Sweep",
        "difficulty": "Beginner",
        "description": (
            "The scissor sweep uses a scissoring action of the legs to off-balance and sweep the opponent. "
            "One leg pushes while the other pulls, creating rotational force to take them down. "
            "It requires good collar and sleeve grip to control the opponent during the sweep. "
            "The scissor sweep is a foundational guard technique taught to all beginners."
        ),
        "steps": [
            "From closed guard, establish cross collar grip and sleeve grip.",
            "Open guard and bring knees to your chest.",
            "Place one shin across opponent's midsection (the cutting leg).",
            "Place opposite knee behind their knee on the same side.",
            "Pull the sleeve down while pushing the collar in opposite direction.",
            "Scissor your legs simultaneously to complete the sweep.",
        ],
        "common_mistakes": [
            "Using arms instead of leg scissoring action.",
            "Not loading opponent's weight before executing.",
            "Placing the knee behind wrong leg.",
            "Losing collar grip during the sweep.",
        ],
        "counters": [
            "Base out with the free hand.",
            "Step back to avoid the cutting leg.",
            "Drive forward to pass before scissor is applied.",
        ],
    },
    {
        "name": "Kimura from Guard",
        "position": "Guard",
        "type": "Submission",
        "difficulty": "Beginner",
        "description": (
            "The kimura from guard is a double wrist lock that rotates the shoulder joint. "
            "You control the opponent's wrist and apply a figure-four grip around their arm. "
            "It can finish as a submission or transition into a sweep or back take. "
            "The kimura grip is one of the most versatile control tools in BJJ."
        ),
        "steps": [
            "From closed guard, break opponent's posture.",
            "Grab their wrist with same-side hand.",
            "Bring your opposite arm under their arm and grip your own wrist.",
            "Sit up slightly to create angle and leverage.",
            "Rotate their arm outward and upward in a circular motion.",
            "Drive their wrist toward their upper back to finish.",
        ],
        "common_mistakes": [
            "Not securing the wrist before establishing figure-four.",
            "Pushing instead of rotating the arm.",
            "Allowing opponent to grab their own belt.",
            "Losing the sit-up angle and lying flat.",
        ],
        "counters": [
            "Grab own belt to prevent rotation.",
            "Stack and pass to relieve shoulder pressure.",
            "Step over to counter-attack.",
        ],
    },
    {
        "name": "Rear Naked Choke",
        "position": "Back",
        "type": "Submission",
        "difficulty": "Beginner",
        "description": (
            "The rear naked choke is the most effective submission in BJJ and MMA when applied from the back. "
            "It compresses both carotid arteries simultaneously, causing rapid unconsciousness. "
            "You secure back control with hooks and wrap one arm around the neck. "
            "This technique has one of the highest finish rates in competitive grappling."
        ),
        "steps": [
            "Secure back control with both hooks inside the opponent's thighs.",
            "Control their shoulder/collar area with the choking arm.",
            "Slide your choking arm under their chin to the opposite shoulder.",
            "Bring your free hand to the back of their head or grab your bicep.",
            "Squeeze your choking arm's bicep and forearm against the neck.",
            "Drop your chin to your chest and expand your chest for full compression.",
        ],
        "common_mistakes": [
            "Choking across the jaw instead of under the chin.",
            "Not keeping hooks in, allowing escape.",
            "Not getting arm deep enough under the chin.",
            "Squeezing with hand strength instead of arm muscles.",
        ],
        "counters": [
            "Tuck chin to prevent arm from sliding under.",
            "Grip the choking arm with both hands and pull down.",
            "Turn into opponent to remove back control.",
        ],
    },
    {
        "name": "Bow and Arrow Choke",
        "position": "Back",
        "type": "Submission",
        "difficulty": "Intermediate",
        "description": (
            "The bow and arrow choke is a gi choke from the back that uses collar and leg control. "
            "You pull the collar back while pushing the near leg forward, creating tremendous force. "
            "It is considered one of the most powerful chokes available in gi grappling. "
            "The name comes from the bow-like tension created between collar and leg."
        ),
        "steps": [
            "From back control with seat belt grip, establish deep cross-collar grip.",
            "Slide the bottom hook out and hook the near leg behind the knee.",
            "Keep your bottom arm holding the collar and rotate opponent slightly.",
            "Extend your legs to push opponent's leg forward.",
            "Simultaneously pull the collar grip toward you.",
            "Create tension like drawing a bow for the finish.",
        ],
        "common_mistakes": [
            "Not getting the collar grip deep enough.",
            "Losing the bottom arm before transitioning to leg control.",
            "Not using full body extension.",
            "Releasing collar tension when applying leg hook.",
        ],
        "counters": [
            "Protect the collar before it is gripped.",
            "Turn into opponent before choke is set.",
            "Chin tuck to prevent collar from reaching the neck.",
        ],
    },
    {
        "name": "Armbar from Mount",
        "position": "Mount",
        "type": "Submission",
        "difficulty": "Intermediate",
        "description": (
            "The armbar from mount isolates one of the opponent's arms and hyperextends their elbow. "
            "You pivot your body perpendicular while controlling the arm and fall to one side. "
            "It requires good mount control and the ability to transition smoothly. "
            "This armbar variation is common at all levels of competition."
        ),
        "steps": [
            "From high mount, control opponent's wrists and break their defensive posture.",
            "Post your foot on the mat on the side of the target arm.",
            "Swing your opposite leg over their face, keeping knee tight to their head.",
            "Fall to the side, squeezing your knees together around the arm.",
            "Control the arm with both hands, thumb pointing up.",
            "Raise hips and extend legs to apply pressure to the elbow.",
        ],
        "common_mistakes": [
            "Pivoting too far and losing mount before securing the arm.",
            "Not keeping knees squeezed during the fall.",
            "Allowing opponent to pull their arm out during the pivot.",
            "Falling too quickly before the leg clears the head.",
        ],
        "counters": [
            "Clasping hands together to prevent arm isolation.",
            "Rolling into opponent as they pivot.",
            "Elbow escape before mount is stable.",
        ],
    },
    {
        "name": "Americana",
        "position": "Side Control",
        "type": "Submission",
        "difficulty": "Beginner",
        "description": (
            "The Americana is a keylock that rotates the shoulder in an internal rotation. "
            "You pin the opponent's arm in an L-shape and use your body weight to apply leverage. "
            "It is often the first submission taught from side control to beginners. "
            "The Americana can also transition to the kimura by switching the figure-four grip."
        ),
        "steps": [
            "From side control, isolate opponent's near arm.",
            "Push their wrist to the mat above their head.",
            "Slide your near arm under their elbow, keeping it on the mat.",
            "Grip your other wrist to form a figure-four.",
            "Walk their elbow toward their hip in an arc.",
            "Lift their wrist while keeping elbow on the mat to finish.",
        ],
        "common_mistakes": [
            "Not keeping the elbow pinned to the mat.",
            "Trying to muscle the submission with arm strength.",
            "Allowing the elbow to lift off the mat.",
            "Not moving the elbow toward the hip in the correct arc.",
        ],
        "counters": [
            "Stack on the controlled elbow to flatten it to mat.",
            "Bridge and roll to relieve shoulder pressure.",
            "Straighten arm to convert to straight armbar.",
        ],
    },
    {
        "name": "Ezekiel Choke",
        "position": "Mount",
        "type": "Submission",
        "difficulty": "Intermediate",
        "description": (
            "The Ezekiel choke is a gi choke applied from mount using your own sleeve. "
            "One hand slides inside your sleeve while the other pushes into the neck. "
            "It is difficult to defend because it requires little space to apply. "
            "The Ezekiel is named after Brazilian judoka Ezequiel Paraguassú."
        ),
        "steps": [
            "From mount, maintain heavy pressure and control opponent's head.",
            "Slide one hand inside your own sleeve to the wrist.",
            "Post your forearm across their throat.",
            "Bring the sleeve-gripping hand under their neck.",
            "Grip the back of their neck or far collar.",
            "Drive the forearm into the throat while pulling with the other arm.",
        ],
        "common_mistakes": [
            "Not getting the forearm positioned correctly across the throat.",
            "Not getting the sleeve grip deep enough.",
            "Allowing opponent to create frames to escape mount.",
            "Applying the choke without proper weight distribution.",
        ],
        "counters": [
            "Frame against the hips to recover guard.",
            "Turn head away to prevent sleeve from reaching under neck.",
            "Bridge to off-balance and disrupt choke.",
        ],
    },
    {
        "name": "Upa Escape",
        "position": "Mount",
        "type": "Escape",
        "difficulty": "Beginner",
        "description": (
            "The upa escape, or bridge and roll, is the fundamental mount escape in BJJ. "
            "You trap the opponent's arm and leg, then bridge explosively to reverse the position. "
            "It teaches critical timing and explosiveness for escape techniques. "
            "The upa works especially well when the opponent is high in mount."
        ),
        "steps": [
            "From under mount, trap opponent's arm on one side by hugging it tight.",
            "Simultaneously hook the same side leg with your foot.",
            "Place your feet flat on the mat close to your hips.",
            "Explosively bridge toward the trapped arm side.",
            "Roll through to land in their guard.",
            "Immediately work to pass their guard.",
        ],
        "common_mistakes": [
            "Bridging without trapping the arm and leg first.",
            "Bridging to the side without trapping the foot.",
            "Not bridging high enough with the hips.",
            "Stopping the roll before completing the reversal.",
        ],
        "counters": [
            "Post the free hand to base out against bridge.",
            "Shift hips away from the bridging direction.",
            "Maintain heavy chest pressure to prevent bridge.",
        ],
    },
    {
        "name": "Elbow-Knee Escape",
        "position": "Mount",
        "type": "Escape",
        "difficulty": "Beginner",
        "description": (
            "The elbow-knee escape, also called the shrimp escape, recovers guard from under mount. "
            "You create space with a frame, then use hip escaping movements to slide to half guard or guard. "
            "It is the most technical of the basic mount escapes. "
            "Mastering the shrimp is essential for all ground defense."
        ),
        "steps": [
            "From under mount, frame with one forearm against the hip and one against the neck.",
            "Explosively push the hip frame to create space.",
            "Shoot your knee across their body toward the elbow of your hip frame.",
            "Shrimp your hips away while inserting the knee.",
            "Create enough space to get to half guard.",
            "Work to recover full guard from half guard.",
        ],
        "common_mistakes": [
            "Not creating enough space with the frame before moving the knee.",
            "Moving too slowly, allowing opponent to re-establish pressure.",
            "Framing against the knee instead of the hip.",
            "Not shrimping hips away simultaneously.",
        ],
        "counters": [
            "Establish high mount to make framing harder.",
            "Knee on belly to remove hip space.",
            "Cross-face to flatten and control the head.",
        ],
    },
    {
        "name": "Kimura from Side Control",
        "position": "Side Control",
        "type": "Submission",
        "difficulty": "Beginner",
        "description": (
            "The kimura from side control attacks the near arm of a bottom player. "
            "You isolate the arm and use a figure-four lock to rotate the shoulder joint. "
            "It can finish as a submission or transition to north-south or back take. "
            "The kimura grip from side control offers many control and attack options."
        ),
        "steps": [
            "From side control, isolate the near arm by driving your weight over it.",
            "Bring their arm to a 90-degree angle at the elbow.",
            "Grab their wrist from above with your near hand.",
            "Thread your far arm under their tricep and grip your own wrist.",
            "Clear your head to the far side to create leverage.",
            "Rotate their arm upward toward their head to finish.",
        ],
        "common_mistakes": [
            "Not clearing the head to the far side for leverage.",
            "Trying to rotate before getting the figure-four locked.",
            "Allowing opponent to grab their belt.",
            "Not keeping elbow close to their body.",
        ],
        "counters": [
            "Grab own belt to prevent rotation.",
            "Roll into opponent to relieve shoulder pressure.",
            "Hip escape to create distance.",
        ],
    },
    {
        "name": "Guillotine Choke",
        "position": "Standing",
        "type": "Submission",
        "difficulty": "Beginner",
        "description": (
            "The guillotine choke attacks the neck when an opponent shoots in for a takedown. "
            "You wrap an arm around the neck and use the forearm to compress the trachea or carotid arteries. "
            "It can be finished standing or by pulling guard. "
            "The guillotine is one of the most common submissions in MMA due to its availability."
        ),
        "steps": [
            "When opponent shoots in for a takedown, sprawl and over-hook around the neck.",
            "Position your forearm under their chin against the throat.",
            "Clasp your hands using a gable grip or figure-four.",
            "Jump guard and close your legs around their waist.",
            "Arch back while squeezing your elbows together.",
            "Drive your hips up while pulling the neck up to finish.",
        ],
        "common_mistakes": [
            "Not getting the arm deep enough under the chin.",
            "Pulling down instead of up, reducing pressure.",
            "Locking guard on the wrong side of the body.",
            "Losing the grip when opponent defends.",
        ],
        "counters": [
            "Tuck chin and drive head into hip to escape.",
            "Posture up before guard is closed.",
            "Stack and pass to relieve guillotine pressure.",
        ],
    },
    {
        "name": "Double Leg Takedown",
        "position": "Standing",
        "type": "Transition",
        "difficulty": "Beginner",
        "description": (
            "The double leg takedown shoots in to control both of the opponent's legs and drive them to the mat. "
            "You change levels, penetrate with a step, and wrap both legs while driving forward. "
            "It is one of the most fundamental wrestling-based takedowns used in BJJ. "
            "Proper level change and drive are key components for a successful double leg."
        ),
        "steps": [
            "From standing, create a level change by bending the knees.",
            "Step your lead foot between opponent's feet.",
            "Drive forward while wrapping both arms around their legs.",
            "Keep your head up and chest pressed against their body.",
            "Drive through them with your hips, not just your shoulders.",
            "Continue through to a top position such as side control.",
        ],
        "common_mistakes": [
            "Shooting with head down, exposing neck to guillotine.",
            "Not changing levels before shooting.",
            "Stopping the drive before completing the takedown.",
            "Grabbing too low (below knees) reducing control.",
        ],
        "counters": [
            "Sprawl hips back to stuff the shot.",
            "Guillotine choke as they shoot in.",
            "Whizzer to off-balance and prevent lift.",
        ],
    },
    {
        "name": "Half Guard Sweep (Dogfight)",
        "position": "Half Guard",
        "type": "Sweep",
        "difficulty": "Intermediate",
        "description": (
            "The dogfight sweep from half guard transitions through a scramble to a back take or sweep. "
            "You come to your knees from under half guard and fight for position in a dogfight position. "
            "The sweep is initiated by hooking the hip and driving under the opponent. "
            "The dogfight is a key position in modern wrestling and BJJ."
        ),
        "steps": [
            "From under half guard, underhook the far arm.",
            "Come to your knees by shrimping out and recovering the underhook.",
            "Meet opponent in dogfight position (both on knees facing same direction).",
            "Hook your foot behind their near knee.",
            "Drive your shoulder into their far hip while pulling the foot hook.",
            "Rotate to complete the sweep and end on top.",
        ],
        "common_mistakes": [
            "Losing the underhook when transitioning to knees.",
            "Not hooking the knee during the sweep.",
            "Driving with shoulder without the leg hook.",
            "Coming up too high and losing leverage.",
        ],
        "counters": [
            "Counter-underhook to prevent coming to knees.",
            "Whizzer to off-balance during dogfight.",
            "Sprawl back to flatten opponent.",
        ],
    },
    {
        "name": "Back Take from Turtle",
        "position": "Turtle",
        "type": "Transition",
        "difficulty": "Intermediate",
        "description": (
            "Taking the back from the turtle position exploits the defensive posture many grapplers use. "
            "You work from beside or behind the turtled opponent to insert hooks and establish seat belt control. "
            "The transition requires timing and control to prevent the opponent from rolling or escaping. "
            "Back control from turtle is a high percentage position in BJJ competition."
        ),
        "steps": [
            "From beside the turtled opponent, establish a seat belt grip (one arm over, one under).",
            "Insert the near hook (leg) between their thighs.",
            "Roll back to lift them up and insert the second hook.",
            "Maintain seat belt control with both hooks in.",
            "Work to flatten them out for submissions.",
            "Transition to rear naked choke or bow and arrow.",
        ],
        "common_mistakes": [
            "Inserting hooks before establishing seat belt control.",
            "Allowing opponent to roll before second hook is in.",
            "Not maintaining chest-to-back contact.",
            "Losing the seat belt when transitioning hooks.",
        ],
        "counters": [
            "Keep elbows tight to prevent seat belt.",
            "Roll toward the over-hook arm before hooks are inserted.",
            "Sit out to prevent back take.",
        ],
    },
    {
        "name": "De La Riva Hook",
        "position": "Open Guard",
        "type": "Control",
        "difficulty": "Advanced",
        "description": (
            "The De La Riva guard uses a hook around the outside of the opponent's lead leg to control distance. "
            "Your leg wraps around the outside while your same-side hand grips their ankle. "
            "It is a sophisticated guard that sets up sweeps and back takes against standing opponents. "
            "De La Riva guard was popularized by Ricardo De La Riva in the 1980s."
        ),
        "steps": [
            "As opponent stands in your guard, place your foot on their near hip.",
            "Wrap your other leg around the outside of their lead leg.",
            "Hook their far leg with your calf from outside.",
            "Grip their near ankle with same-side hand.",
            "Grip their far collar or sleeve with the other hand.",
            "Use the combination of hooks and grips to control and set up attacks.",
        ],
        "common_mistakes": [
            "Not getting the hook deep enough around the leg.",
            "Losing ankle grip which removes the control.",
            "Not maintaining the hip-on-hip foot connection.",
            "Being too passive and allowing opponent to disengage.",
        ],
        "counters": [
            "Knee slide pass over the hooking leg.",
            "Leg drag to remove the hook.",
            "Backstep pass to disengage from the De La Riva.",
        ],
    },
    {
        "name": "X-Guard Sweep",
        "position": "Open Guard",
        "type": "Sweep",
        "difficulty": "Advanced",
        "description": (
            "The X-guard uses both legs to control one of the opponent's legs in an X formation beneath them. "
            "You sit under their hips and use leg hooks to elevate and off-balance them for sweeps. "
            "It is highly effective against standing opponents and in leg lock entries. "
            "Marcelo Garcia popularized the X-guard in high-level competition."
        ),
        "steps": [
            "Enter X-guard by shooting under opponent's hips from De La Riva or butterfly.",
            "Hook one leg behind their knee and the other under their thigh.",
            "Cross your feet to create the X configuration.",
            "Hold their foot or ankle to control the near leg.",
            "Sit up slightly to load their weight on your legs.",
            "Extend legs upward and to the side to execute the sweep.",
        ],
        "common_mistakes": [
            "Not getting under opponent's hips enough.",
            "Not controlling their foot, allowing base adjustment.",
            "Sweeping without loading their weight first.",
            "Losing the X configuration before completing the sweep.",
        ],
        "counters": [
            "Sprawl back to prevent entry under the hips.",
            "Step over the hook to disengage.",
            "Post foot wide to maintain base against the sweep.",
        ],
    },
]

RELATIONSHIPS = [
    ("Armbar from Guard", "leads_to", "Triangle Choke"),
    ("Armbar from Guard", "leads_to", "Omoplata"),
    ("Triangle Choke", "leads_to", "Omoplata"),
    ("Triangle Choke", "leads_to", "Armbar from Guard"),
    ("Hip Bump Sweep", "leads_to", "Kimura from Guard"),
    ("Kimura from Guard", "leads_to", "Hip Bump Sweep"),
    ("Scissor Sweep", "leads_to", "Armbar from Guard"),
    ("Back Take from Turtle", "leads_to", "Rear Naked Choke"),
    ("Back Take from Turtle", "leads_to", "Bow and Arrow Choke"),
    ("Rear Naked Choke", "defends_against", "Bow and Arrow Choke"),
    ("Upa Escape", "escapes_from", "Armbar from Mount"),
    ("Upa Escape", "escapes_from", "Ezekiel Choke"),
    ("Elbow-Knee Escape", "escapes_from", "Armbar from Mount"),
    ("Elbow-Knee Escape", "escapes_from", "Americana"),
    ("Double Leg Takedown", "leads_to", "Back Take from Turtle"),
    ("Double Leg Takedown", "leads_to", "Guillotine Choke"),
    ("Guillotine Choke", "counters", "Double Leg Takedown"),
    ("De La Riva Hook", "leads_to", "X-Guard Sweep"),
    ("X-Guard Sweep", "leads_to", "Double Leg Takedown"),
    ("Half Guard Sweep (Dogfight)", "leads_to", "Back Take from Turtle"),
]


def seed() -> None:
    create_db_and_tables()

    with Session(engine) as session:
        existing = session.exec(select(Technique)).first()
        if existing:
            print("Database already seeded. Skipping.")
            return

        name_to_id: dict[str, int] = {}
        for data in TECHNIQUES:
            technique = Technique(**data)
            session.add(technique)
            session.flush()
            name_to_id[technique.name] = technique.id  # type: ignore[assignment]

        for from_name, rel_type, to_name in RELATIONSHIPS:
            rel = TechniqueRelationship(
                from_technique_id=name_to_id[from_name],
                to_technique_id=name_to_id[to_name],
                relationship_type=rel_type,
            )
            session.add(rel)

        session.commit()
        print(f"Seeded {len(TECHNIQUES)} techniques and {len(RELATIONSHIPS)} relationships.")


if __name__ == "__main__":
    seed()
